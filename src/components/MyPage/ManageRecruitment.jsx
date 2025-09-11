import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // useSelector import
import { Link } from 'react-router-dom';
import axios from 'axios';

// 승인 상태에 따라 뱃지 스타일을 반환하는 함수
const getStatusStyle = (status) => {
  switch (status) {
    case 'APPROVED':
      return { color: 'green', fontWeight: 'bold' };
    case 'REJECTED':
      return { color: 'red', fontWeight: 'bold' };
    case 'PENDING':
    default:
      return { color: 'orange', fontWeight: 'bold' };
  }
};

export default function ManageRecruitment() {
  const [myGroups, setMyGroups] = useState([]); // 내가 만든 모임만 저장할 state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redux store에서 토큰을 가져옵니다.
  const token = useSelector(state => state.auth.token); 

  useEffect(() => {
    // 토큰이 없으면 API를 호출하지 않습니다.
    if (!token) {
        setLoading(false);
        return;
    };

    const fetchGroups = async () => {
      try {
        const res = await axios.get('/api/users/me/groups', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // ✅ API 응답 데이터에서 leader가 true인 모임만 필터링합니다.
        const filteredGroups = res.data.filter(group => group.leader);
        setMyGroups(filteredGroups);
        console.log(res.data);
      } catch (err) {
        console.error('API Error:', err);
        setError('데이터를 불러오는 데 실패했습니다.');
        setMyGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [token]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="content-panel">
      <h2>모집 활동 관리</h2>
      <p>내가 만든 모임만 확인할 수 있습니다.</p>

      {myGroups.length === 0 ? (
        <p>생성한 모임이 없습니다.</p>
      ) : (
        myGroups.map(group => (
          <Link
            key={group.groupId}
            to={`/groups/${group.groupId}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="group-card">
              <h3>{group.groupName}</h3>
              <p><strong>지역:</strong> {group.regionName}</p>
              <p><strong>종목:</strong> {group.sportName}</p>
              <p><strong>설명:</strong> {group.description}</p>
              <p>
                <strong>승인 상태:</strong>
                <span style={getStatusStyle(group.approvalStatus)}>
                  {group.approvalStatus === 'APPROVED'
                    ? '승인'
                    : group.approvalStatus === 'REJECTED'
                    ? '거절'
                    : '대기'}
                </span>
              </p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}