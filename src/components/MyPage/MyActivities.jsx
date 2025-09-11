import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyActivities({ user }) {
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // API 호출: 내 활동 정보 조회
    axios
      .get(`/api/users/${user.userId}/applications`)
      .then((res) => {
        // API 응답 예시: [{ groupName, status, role }, ...]
        setMyApplications(res.data);
      })
      .catch((err) => {
        console.error('내 활동 불러오기 실패:', err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div>활동 정보를 불러오는 중...</div>;
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

          const roleText = app.role === 'leader' ? '리더' : '참여자';

          return (
            <li key={index} className={`activity-card ${statusClass}`}>
              {/* 롤 배지 우측 상단 */}
              <span className={`role-badge ${app.role}`}>{roleText}</span>

              <span className="group-name">{app.groupName}</span>
              <span className="status-badge">{app.status}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
