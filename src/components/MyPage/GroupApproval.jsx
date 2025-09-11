import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function GroupApproval() {
  const [pendingGroups, setPendingGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('accessToken'); // JWT 토큰

  useEffect(() => {
    if (!token) return;

    const fetchPendingGroups = async () => {
      try {
        const res = await axios.get('/api/admin/groups/pending', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // API에서 내려주는 그대로 상태에 저장
        setPendingGroups(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('API Error:', err);
        setError('승인 대기 모임을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingGroups();
  }, [token]);

  // 승인 처리
  const handleApprove = async (groupId) => {
    try {
      await axios.post(
        `/api/admin/groups/${groupId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 상태에서 제거
      setPendingGroups(prev => prev.filter(group => group.groupId !== groupId));
      alert(`${groupId}번 모임을 승인했습니다.`);
    } catch (err) {
      console.error(err);
      alert('승인 처리에 실패했습니다.');
    }
  };

  // 거절 처리
  const handleReject = async (groupId) => {
    try {
      await axios.post(
        `/api/admin/groups/${groupId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 상태에서 제거
      setPendingGroups(prev => prev.filter(group => group.groupId !== groupId));
      alert(`${groupId}번 모임을 거절했습니다.`);
    } catch (err) {
      console.error(err);
      alert('거절 처리에 실패했습니다.');
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-tab-content">
      <h3>승인 대기 모임 목록</h3>
      {pendingGroups.length === 0 ? (
        <p>승인 대기 중인 모임이 없습니다.</p>
      ) : (
        <ul className="data-list">
          {pendingGroups.map(group => (
            <li key={group.groupId} className="data-list-item">
              <div className="item-info">
                <span className="item-title">{group.groupName}</span>
                <span className="item-detail">
                  지역: {group.regionName}, 종목: {group.sportName}
                </span>
              </div>
              <div className="item-actions">
                <button className="approve-btn"onClick={() => handleApprove(group.groupId)}>승인</button>
                <button className="reject-btn"onClick={() => handleReject(group.groupId)}>거절</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}