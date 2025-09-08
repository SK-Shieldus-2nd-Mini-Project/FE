import React, { useState } from 'react';

// 임시 데이터
const initialPendingGroups = [
  { id: 1, name: '퇴근 후 즐거운 풋살 모임', leader: '풋살왕' },
  { id: 2, name: '주말마다 북한산 등반해요', leader: '산타요정' },
  { id: 3, name: '매주 수요일 배드민턴 클럽', leader: '스매싱' },
];

export default function GroupApproval() {
  const [pendingGroups, setPendingGroups] = useState(initialPendingGroups);

  const handleApprove = (groupId) => {
    alert(`${groupId}번 모임을 승인했습니다.`);
    setPendingGroups(pendingGroups.filter(group => group.id !== groupId));
  };
  
  const handleReject = (groupId) => {
    alert(`${groupId}번 모임을 거절했습니다.`);
    setPendingGroups(pendingGroups.filter(group => group.id !== groupId));
  };

  return (
    <div className="admin-tab-content">
      <h3>승인 대기 모임 목록</h3>
      {pendingGroups.length === 0 ? (
        <p>승인 대기 중인 모임이 없습니다.</p>
      ) : (
        <ul className="data-list">
          {pendingGroups.map(group => (
            <li key={group.id} className="data-list-item">
              <div className="item-info">
                <span className="item-title">{group.name}</span>
                <span className="item-detail">모임장: {group.leader}</span>
              </div>
              <div className="item-actions">
                <button className="approve-btn" onClick={() => handleApprove(group.id)}>승인</button>
                <button className="reject-btn" onClick={() => handleReject(group.id)}>거절</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}