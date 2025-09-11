import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageRecruitment({ userId }) {
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    axios.get(`/api/groups/created?userId=${userId}`)
      .then(res => setMyGroups(res.data))
      .catch(err => {
        console.error(err);
        setMyGroups([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="content-panel">
      <h2>모집 활동 관리</h2>
      <p>내가 만든 모임의 가입 신청자를 관리합니다.</p>

      {myGroups.length === 0 ? (
        <p>생성한 모임이 없습니다.</p>
      ) : (
        myGroups.map(group => (
          <div key={group.id} className="group-card">
            <h3>{group.name}</h3>
            <p>{group.description}</p>
            <p>신청자 수: {group.applicants.length}</p>

            <ul>
              {group.applicants.map(applicant => (
                <li key={applicant.id}>
                  {applicant.nickname} - {applicant.status}
                  {/* 승인/거절 버튼 추가 가능 */}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}