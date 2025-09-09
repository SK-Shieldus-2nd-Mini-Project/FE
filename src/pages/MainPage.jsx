import React, { useState } from 'react';
import '../assets/MainPage.css';
import { Link } from 'react-router-dom';
import TrueFocus from '../components/TrueFocus.jsx';
import GroupForm from '../components/GroupForm.jsx';
import { motion } from 'framer-motion';
import AnimatedFilterButton from '../components/AnimatedFilterButton';
import useFilteredGroups from '../hooks/useFilteredGroups'; // ✅ 추가

const regionOptions = [
    "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구",
    "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구",
    "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"
];
const sportOptions = ["조깅","농구", "등산", "자전거"];

// 임시 데이터
const dummyGroups = [
    { id: 1, name: '아침마다 함께 뛰어요! 조깅 크루', region: '강남구', sport: '조깅', currentMembers: 5, maxMembers: 10, imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop', recommended: true },
    { id: 2, name: '주말 저녁 농구 한판 하실 분?', region: '관악구', sport: '농구', currentMembers: 8, maxMembers: 12, imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1974&auto=format&fit=crop', recommended: true },
    { id: 3, name: '등산 초보 모여라! 관악산 등반', region: '강동구', sport: '등산', currentMembers: 3, maxMembers: 8, imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop', recommended: false },
    { id: 4, name: '한강 자전거 라이딩 모임', region: '종로구', sport: '자전거', currentMembers: 12, maxMembers: 20, imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop', recommended: false },
];

const focusFont = {
    fontSize: "3rem",
    fontWeight: "bold",
    fontFamily: "'KakaoSmallSans-Bold', sans-serif",
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};
const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export default function MainPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedSport, setSelectedSport] = useState(null);
    const [searchText, setSearchText] = useState("");

    // ✅ 커스텀 훅으로 필터링 처리
    const filteredGroups = useFilteredGroups(dummyGroups, {
        region: selectedRegion,
        sport: selectedSport,
        searchText,
    });

    const recommendedGroups = filteredGroups.filter(group => group.recommended);

    return (
        <motion.main className="main-container" variants={containerVariants} initial="hidden" animate="visible">
            
            {/* 키워드 애니메이션 */}
            <motion.section className="focus-keywords-section" variants={itemVariants}>
                <TrueFocus
                    text="런닝 자전거 농구"
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
                    <AnimatedFilterButton buttonText="지역" options={regionOptions} onSelect={setSelectedRegion} />
                    <AnimatedFilterButton buttonText="종목 선택" options={sportOptions} onSelect={setSelectedSport} />
                    <input
                        type="text"
                        placeholder="모임 이름으로 검색"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
                <button className="create-group-btn" onClick={() => setIsModalOpen(true)}>
                    모임 모집하기
                </button>
            </motion.section>

            {/* 추천 모임 */}
            <motion.section className="group-list-section" variants={itemVariants}>
                <h2>추천 모임</h2>
                <div className="group-grid">
                    {recommendedGroups.length > 0 ? (
                        recommendedGroups.map(group => (
                            <Link to={`/groups/${group.id}`} key={group.id} className="group-card-link">
                                <div className="group-card">
                                    <img src={group.imageUrl} alt={group.name} />
                                    <div className="group-info">
                                        <h3>{group.name}</h3>
                                        <p># {group.region} # {group.sport}</p>
                                        <span>{group.currentMembers} / {group.maxMembers}명</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p>추천 모임이 없습니다.</p>
                    )}
                </div>
            </motion.section>

            {/* 전체 모임 */}
            <motion.section className="group-list-section" variants={itemVariants}>
                <h2>전체 모임</h2>
                <div className="group-grid">
                    {filteredGroups.length > 0 ? (
                        filteredGroups.map(group => (
                            <Link to={`/groups/${group.id}`} key={group.id} className="group-card-link">
                                <div className="group-card">
                                    <img src={group.imageUrl} alt={group.name} />
                                    <div className="group-info">
                                        <h3>{group.name}</h3>
                                        <p># {group.region} # {group.sport}</p>
                                        <span>{group.currentMembers} / {group.maxMembers}명</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p>검색 결과가 없습니다.</p>
                    )}
                </div>
            </motion.section>

            {/* 모달 */}
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