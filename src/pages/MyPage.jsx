import React, { useState } from 'react';
import MyPageSidebar from '../components/MyPage/MyPageSidebar';
import EditProfile from '../components/MyPage/EditProfile';
import MyActivities from '../components/MyPage/MyActivities';
import ManageRecruitment from '../components/MyPage/ManageRecruitment';
import AdminPanel from '../components/MyPage/AdminPanel';
import '../assets/MyPage/MyPage.css';

// TODO: 실제 로그인된 사용자 정보를 받아와야 함
// 현재는 'user', 'leader', 'admin' 중 하나로 변경하여 테스트
const currentUser = {
  role: 'admin', // 'user', 'leader', 'admin'
  nickname: '운동매니아',
  hasCreatedGroup: true, // 모임을 생성했는지 여부
};

export default function MyPage() {
  const [activeTab, setActiveTab] = useState('editProfile');

  const renderContent = () => {
    switch (activeTab) {
      case 'editProfile':
        return <EditProfile />;
      case 'myActivities':
        return <MyActivities />;
      case 'manageRecruitment':
        return <ManageRecruitment />;
      case 'adminPanel':
        return <AdminPanel />;
      default:
        return <EditProfile />;
    }
  };

  return (
    <div className="mypage-container">
      <MyPageSidebar
        user={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <main className="mypage-content">
        {renderContent()}
      </main>
    </div>
  );
}