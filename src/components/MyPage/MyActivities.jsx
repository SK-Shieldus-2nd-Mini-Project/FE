import React from 'react';

// 임시 데이터
const myApplications = [
    { groupName: '아침마다 함께 뛰어요!', status: '승인 대기중' },
    { groupName: '한강 자전거 라이딩', status: '승인 완료' },
    { groupName: '주말 저녁 농구 한판', status: '거절됨' },
];

export default function MyActivities() {
  return (
    <div className="content-panel">
      <h2>내 활동</h2>
      <p>모임 가입 신청 현황을 확인합니다.</p>
      <ul className="status-list">
        {myApplications.map((app, index) => (
            <li key={index} className={`status-${app.status.includes('완료') ? 'approved' : app.status.includes('대기') ? 'pending' : 'rejected'}`}>
                <span className="group-name">{app.groupName}</span>
                <span className="status-badge">{app.status}</span>
            </li>
        ))}
      </ul>
    </div>
  );
}