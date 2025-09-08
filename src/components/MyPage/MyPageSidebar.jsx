import React from 'react';

export default function MyPageSidebar({ user, activeTab, setActiveTab }) {
  return (
    <aside className="mypage-sidebar">
      <div className="profile-summary">
        <img src="/public/mymelody.png" alt="Profile" className="profile-image" />
        <h3>{user.nickname}</h3>
        <p>{user.role === 'admin' ? '관리자' : '일반 회원'}</p>
      </div>
      <nav>
        <ul>
          {/* 공통 메뉴 */}
          <li
            className={activeTab === 'editProfile' ? 'active' : ''}
            onClick={() => setActiveTab('editProfile')}
          >
            회원정보 수정
          </li>

          {/* 일반 사용자 메뉴 */}
          {user.role !== 'admin' && (
            <li
              className={activeTab === 'myActivities' ? 'active' : ''}
              onClick={() => setActiveTab('myActivities')}
            >
              내 활동
            </li>
          )}

          {/* 모임장 메뉴 */}
          {user.hasCreatedGroup && user.role !== 'admin' && (
             <li
              className={activeTab === 'manageRecruitment' ? 'active' : ''}
              onClick={() => setActiveTab('manageRecruitment')}
            >
              모집 활동 관리
            </li>
          )}
          
          {/* 관리자 메뉴 */}
          {user.role === 'admin' && (
            <li
              className={activeTab === 'adminPanel' ? 'active' : ''}
              onClick={() => setActiveTab('adminPanel')}
            >
              관리자 페이지
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}