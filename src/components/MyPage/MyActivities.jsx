import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyActivities({ user }) {
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('user 객체:', user);
    if (!user) return;

    const fetchApplications = async () => {
      try {
        setLoading(true);

        // 백엔드 API 예시: 사용자의 활동 가져오기
        // 각 활동에 role 필드 포함 ('leader' or 'participant')
        const userId = user?.userId;
        if (!userId) return;

        const response = await axios.get(`/api/users/${userId}/activities`);
        console.log('백엔드 응답 데이터:', response.data); 
        setMyApplications(response.data);
      } catch (err) {
        console.error(err);
        setError('활동 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  if (loading) return <div>활동 정보를 불러오는 중...</div>;
  if (error) return <div>{error}</div>;
  if (myApplications.length === 0) return <div>참여 중인 활동이 없습니다.</div>;

  return (
    <div className="content-panel">
      <h2>내 활동</h2>
      <p>모임 가입 신청 현황을 확인합니다.</p>
      <ul className="status-list">
        {myApplications.map((app, index) => {
          const statusClass = app.status.includes('완료')
            ? 'approved'
            : app.status.includes('대기')
            ? 'pending'
            : 'rejected';
          return (
            <li key={index} className={`status-${statusClass}`}>
              <div className="group-header">
                <span className="group-name">{app.groupName}</span>
                <span
                  className={`role-badge ${
                    app.role === 'leader' ? 'leader' : 'participant'
                  }`}
                >
                  {app.role === 'leader' ? '리더' : '참여자'}
                </span>
              </div>
              <span className="status-badge">{app.status}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
