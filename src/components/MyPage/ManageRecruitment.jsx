import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageRecruitment() {
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('accessToken'); // JWT 토큰

  useEffect(() => {
    if (!token) return;

    const fetchGroups = async () => {
      try {
        const res = await axios.get('/api/users/me/groups', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // API에서 내려주는 그대로 상태에 저장
        setMyGroups(res.data);
        console.log('API Response:', res.data); // 브라우저 콘솔에서 확인 가능
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
          <div key={group.groupId} className="group-card">
            <h3>{group.groupName}</h3>
            <p>지역: {group.regionName}</p>
            <p>종목: {group.sportName}</p>
          </div>
        ))
      )}
    </div>
  );
}