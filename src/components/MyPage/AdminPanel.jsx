import React, { useState } from 'react';
import GroupApproval from './GroupApproval';
import UserManagement from './UserManagement';
import '../../assets/MyPage/AdminPanel.css'; // AdminPanel 전용 CSS 파일을 import

export default function AdminPanel() {
  const [activeAdminTab, setActiveAdminTab] = useState('groups');

  return (
    <div className="admin-panel-container">
      <h2>관리자 페이지</h2>
      <nav className="admin-nav">
        <button
          className={activeAdminTab === 'groups' ? 'active' : ''}
          onClick={() => setActiveAdminTab('groups')}
        >
          모임 승인 관리
        </button>
        <button
          className={activeAdminTab === 'users' ? 'active' : ''}
          onClick={() => setActiveAdminTab('users')}
        >
          회원 관리
        </button>
      </nav>
      <div className="admin-content">
        {activeAdminTab === 'groups' ? <GroupApproval /> : <UserManagement />}
      </div>
    </div>
  );
}