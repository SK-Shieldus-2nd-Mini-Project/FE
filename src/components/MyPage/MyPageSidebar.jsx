import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyPageSidebar({ user, activeTab, setActiveTab }) {
  const [hasCreatedGroup, setHasCreatedGroup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken'); // JWT 토큰 저장 위치 확인

    if (!token) return;

    axios.get('/api/users/me/groups', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        const created = res.data.some(group => group.leader_id === user.userId);
        setHasCreatedGroup(created);
      })
      .catch(err => console.error(err));
  }, [user.userId]);

  return (
    <aside className="mypage-sidebar">
      <div className="profile-summary">
        <img
          src={user.profileImage || '/public/mymelody.png'}
          alt="Profile"
          className="profile-image"
        />
        <h3>{user.nickname}</h3>
        <p>{user.role === 'ADMIN' ? '관리자' : '일반 회원'}</p>
      </div>

      <nav>
        <ul>
          <li
            className={activeTab === 'editProfile' ? 'active' : ''}
            onClick={() => setActiveTab('editProfile')}
          >
            회원정보 수정
          </li>

          {user.role !== 'ADMIN' && (
            <>
              <li
                className={activeTab === 'myActivities' ? 'active' : ''}
                onClick={() => setActiveTab('myActivities')}
              >
                내 활동
              </li>

              {hasCreatedGroup || (
                <li
                  className={activeTab === 'manageRecruitment' ? 'active' : ''}
                  onClick={() => setActiveTab('manageRecruitment')}
                >
                  모집 활동 관리
                </li>
              )}
            </>
          )}

          {user.role === 'ADMIN' && (
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