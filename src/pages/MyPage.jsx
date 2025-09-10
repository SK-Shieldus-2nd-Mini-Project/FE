import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import MyPageSidebar from '../components/MyPage/MyPageSidebar';
import EditProfile from '../components/MyPage/EditProfile';
import MyActivities from '../components/MyPage/MyActivities';
import ManageRecruitment from '../components/MyPage/ManageRecruitment';
import AdminPanel from '../components/MyPage/AdminPanel';
import '../assets/MyPage/MyPage.css';

export default function MyPage() {
  const [activeTab, setActiveTab] = useState('editProfile');
  const { user } = useSelector((state) => state.auth);

  const renderContent = () => {
    switch (activeTab) {
      case 'editProfile':
        return <EditProfile user={user} />;
      case 'myActivities':
        return <MyActivities user={user} />; // 새로 만든 MyActivities 컴포넌트
      case 'manageRecruitment':
        return <ManageRecruitment user={user} />;
      case 'adminPanel':
        return <AdminPanel user={user} />;
      default:
        return <EditProfile user={user} />;
    }
  };

  if (!user) {
    return <div>로그인 후 이용해주세요.</div>;
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
