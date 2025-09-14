import React, { useState } from 'react';
import MyPageSidebar from '../components/MyPage/MyPageSidebar';
import EditProfile from '../components/MyPage/EditProfile';
import MyActivities from '../components/MyPage/MyActivities';
import ManageRecruitment from '../components/MyPage/ManageRecruitment';
import AdminPanel from '../components/MyPage/AdminPanel';
import '../assets/MyPage/MyPage.css';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, duration: 0.5 } },
};
const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

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
    <motion.div className="mypage-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
      <MyPageSidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      </motion.div>
      <motion.main className="mypage-content" variants={itemVariants}>
        {renderContent()}
      </motion.main>
    </motion.div>
  );
}