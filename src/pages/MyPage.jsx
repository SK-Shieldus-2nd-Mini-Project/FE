import React, { useState } from 'react';
import MyPageSidebar from '../components/MyPage/MyPageSidebar';
import EditProfile from '../components/MyPage/EditProfile';
import MyActivities from '../components/MyPage/MyActivities';
import ManageRecruitment from '../components/MyPage/ManageRecruitment';
import AdminPanel from '../components/MyPage/AdminPanel';
import '../assets/MyPage/MyPage.css';
import { useSelector } from 'react-redux';

export default function MyPage() {
  const [activeTab, setActiveTab] = useState('editProfile');
  const { user } = useSelector((state) => state.auth);

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

  if(!user) {
    return <div>로그인 후 이용해주세요.</div>
  }

  return (
    <div className="mypage-container">
      <MyPageSidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <main className="mypage-content">
        {renderContent()}
      </main>
    </div>
  );
}