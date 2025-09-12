import React, { useState, useEffect } from 'react';
import '../assets/MainPage.css';
import { useNavigate, Link } from 'react-router-dom';
import TypewriterEffect from '../components/TypewriterEffect.jsx';
import GroupForm from '../components/GroupForm.jsx';
import { motion } from 'framer-motion';
import AnimatedFilterButton from '../components/AnimatedFilterButton';
import useFilteredGroups from '../hooks/useFilteredGroups'; // ✅ 커스텀 훅
import { useSelector, useDispatch } from "react-redux";
import { fetchAllGroups } from '../redux/groupSlice.js';

const regionOptions = [
    "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구",
    "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구",
    "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"
];
const sportOptions = ["러닝", "자전거", "농구", "야구", "축구", "배드민턴", "족구", "등산", "볼링", "탁구"];

const focusFont = {
    fontSize: "2.5rem",
    fontWeight: "1000",
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

    // 로그인 인증
    const isLoggedIn = useSelector(state => state.auth.isAuthenticated);
    const navigate = useNavigate();
    // ✅ 입력 값과 실제 검색어 분리
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const dispatch = useDispatch();
    const { groups } = useSelector(state => state.group);

    useEffect(() => {
        dispatch(fetchAllGroups());
    }, [dispatch]);

    // ✅ 검색 버튼 누를 때만 searchQuery 업데이트
    const handleSearch = () => {
        setSearchQuery(searchText);
    };

    // ✅ 필터링 적용 (searchQuery만 반영됨)
    const filteredGroups = useFilteredGroups(groups, {
        region: selectedRegion,
        sport: selectedSport,
        searchText: searchQuery,
    });

    const typewriterWords = [
        { word: "런닝" },
        { word: "자전거" },
        { word: "농구" },
        { word: "축구" },
        { word: "야구" },
        { word: "배드민턴" },
        { word: "족구" },
        { word: "테니스" },
        { word: "볼링" },
        { word: "탁구" },
    ];
    return (
        <motion.main className="main-container" variants={containerVariants} initial="hidden" animate="visible">

            {/* 키워드 애니메이션 */}
            <motion.section className="focus-keywords-section" variants={itemVariants}>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2c3e50', fontFamily: 'KakaoSmallSans-Bold, sans-serif' }}>
                    오늘&nbsp;
                    {/* <span style={{
                        background: '#beefffff',
                        color: '#fff',
                        borderRadius: '3px',
                        padding: '5px'
                    }}> */}
                    <TypewriterEffect
                        words={typewriterWords}
                        typingSpeed={150}
                        deletingSpeed={100}
                        pauseDuration={4000}
                        font={focusFont}
                        textColor="#2f71ff"
                        cursorColor="#2f71ff"
                    />
                    {/* </span> */}
                    &nbsp;어때요?
                </span>
            </motion.section>

            {/* 필터 섹션 */}
            <motion.section className="filter-section" variants={itemVariants}>
                <div className="filters">
                    <AnimatedFilterButton buttonText="지역" options={regionOptions} onSelect={setSelectedRegion} />
                    <AnimatedFilterButton buttonText="종목 선택" options={sportOptions} onSelect={setSelectedSport} />

                    {/* 검색창 + 버튼 */}
                    <input
                        type="text"
                        placeholder="모임 이름으로 검색"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button className="search-btn" onClick={handleSearch}>찾기</button>
                </div>

                {/* 모임 모집하기 버튼 */}
                <button
                    className="create-group-btn"
                    onClick={() => {
                        if (!isLoggedIn) {
                            // 로그인 안 됐으면 alert 후 로그인 페이지로 이동
                            alert("로그인이 필요합니다.");
                            navigate("/login");
                        } else {
                            // 로그인 되어 있으면 모달 열기
                            setIsModalOpen(true);
                        }
                    }}
                >
                    모임 모집하기
                </button>
            </motion.section>


            {/* 전체 모임 */}
            <motion.section className="group-list-section" variants={itemVariants}>
                <h2>전체 모임</h2>
                <div className="group-grid">
                    {filteredGroups.length > 0 ? (
                        filteredGroups.map(group => (
                            <Link to={`/groups/${group.groupId}`} key={group.groupId} className="group-card-link">
                                <div className="group-card">
                                    <img src={group.imageUrl || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop'} alt={group.groupName} />                                    <div className="group-info">
                                        <h3>{group.groupName}</h3>
                                        <p># {group.regionName} # {group.sportName}</p>
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
            {
                isModalOpen && (
                    <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                            <GroupForm />
                        </div>
                    </div>
                )
            }
        </motion.main >
    );
}