import React, { useState } from 'react';

// 임시 데이터
const initialUsers = [
  { id: 'user01', nickname: '운동매니아', role: 'leader' },
  { id: 'user02', nickname: '풋살왕', role: 'user' },
  { id: 'user03', nickname: '산타요정', role: 'user' },
  { id: 'admin', nickname: '관리자', role: 'admin' },
];

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers);

  const handleDelete = (userId) => {
    if (userId === 'admin') {
      alert('관리자 계정은 삭제할 수 없습니다.');
      return;
    }
    alert(`${userId} 회원을 삭제 처리했습니다.`);
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div className="admin-tab-content">
      <h3>전체 회원 관리</h3>
       <ul className="data-list">
          {users.map(user => (
            <li key={user.id} className="data-list-item">
              <div className="item-info">
                <span className="item-title">{user.nickname} ({user.id})</span>
                <span className="item-detail">역할: {user.role}</span>
              </div>
              <div className="item-actions">
                <button className="edit-btn">정보 수정</button>
                <button className="delete-btn" onClick={() => handleDelete(user.id)}>계정 삭제</button>
              </div>
            </li>
          ))}
        </ul>
    </div>
  );
}