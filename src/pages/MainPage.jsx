import React, { useState } from 'react';
import '../assets/MainPage.css';
import { Link } from 'react-router-dom';
import TrueFocus from '../components/TrueFocus.jsx';
import GroupForm from '../components/GroupForm.jsx';
import { motion } from 'framer-motion';

// 임시 데이터
const dummyGroups = [
  {
    id: 1,
    name: '아침마다 함께 뛰어요! 조깅 크루',
    region: '서울',
    sport: '조깅',
    currentMembers: 5,
    maxMembers: 10,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop',
    recommended: true,
  },
  {
    id: 2,
    name: '주말 저녁 농구 한판 하실 분?',
    region: '경기',
    sport: '농구',
    currentMembers: 8,
    maxMembers: 12,
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1974&auto=format&fit=crop',
    recommended: true,
  },
  {
    id: 3,
    name: '등산 초보 모여라! 관악산 등반',
    region: '서울',
    sport: '등산',
    currentMembers: 3,
    maxMembers: 8,
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop',
    recommended: false,
  },
  {
    id: 4,
    name: '한강 자전거 라이딩 모임',
    region: '서울',
    sport: '자전거',
    currentMembers: 12,
    maxMembers: 20,
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop',
    recommended: false,
  },
];

const focusFont = {
    fontSize: "3rem",
    fontWeight: "bold",
    fontFamily: "'KakaoSmallSans-Bold', sans-serif",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // 자식 요소들이 0.2초 간격으로 나타남
    },
  },
};

const itemVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function MainPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const recommendedGroups = dummyGroups.filter(group => group.recommended);
  const allGroups = dummyGroups;

  return (
    <motion.main 
    className="main-container"
    variants={containerVariants}
    initial="hidden"
    animate="visible">
      <motion.section className="focus-keywords-section" variants={itemVariants}>
        <TrueFocus 
          text="런닝 자전거 축구"
          manualMode={false}
          blurAmount={3}
          borderColor="#3498db"
          glowColor="rgba(52, 152, 219, 0.6)"
          animationDuration={0.4}
          pauseBetweenAnimations={1.5}
          textColor="#2c3e50"
          textAlign="center"
          font={focusFont}
        />
      </motion.section>

      {/* 필터 섹션 */}
      <motion.section className="filter-section" variants={itemVariants}>
        <div className="filters">
          <select name="region">
            <option value="">지역 선택</option>
            <option value="seoul">서울</option>
            <option value="gyeonggi">경기</option>
            <option value="incheon">인천</option>
          </select>
          <select name="sport">
            <option value="">종목 선택</option>
            <option value="jogging">조깅</option>
            <option value="basketball">농구</option>
            <option value="hiking">등산</option>
            <option value="cycling">자전거</option>
          </select>
          <input type="text" placeholder="모임 이름으로 검색" />
          <button className="search-btn">찾기</button>
        </div>

        {/* 모임 생성 버튼 → 모달 오픈 */}
        <button className="create-group-btn" onClick={() => setIsModalOpen(true)}>
          모임 모집하기
        </button>
      </motion.section>

      {/* 추천 모임 */}
      <motion.section className="group-list-section" variants={itemVariants}>
        <h2>추천 모임</h2>
        <div className="group-grid">
          {recommendedGroups.map(group => (
            <Link to={`/groups/${group.id}`} key={group.id} className="group-card-link">
            <div key={group.id} className="group-card">
              <img src={group.imageUrl} alt={group.name} />
              <div className="group-info">
                <h3>{group.name}</h3>
                <p># {group.region} # {group.sport}</p>
                <span>{group.currentMembers} / {group.maxMembers}명</span>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* 전체 모임 */}
      <motion.section className="group-list-section" variants={itemVariants}>
        <h2>전체 모임</h2>
        <div className="group-grid">
          {allGroups.map(group => (
            <Link to={`/groups/${group.id}`} key={group.id} className="group-card-link">
            <div key={group.id} className="group-card">
              <img src={group.imageUrl} alt={group.name} />
              <div className="group-info">
                <h3>{group.name}</h3>
                <p># {group.region} # {group.sport}</p>
                <span>{group.currentMembers} / {group.maxMembers}명</span>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* --- 모달 --- */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            <GroupForm />
          </div>
        </div>
      )}
    </motion.main>
  );
}