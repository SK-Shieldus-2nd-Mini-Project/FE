import React, { useState, useEffect } from 'react';
import '../assets/MainPage.css';
import { useNavigate, Link } from 'react-router-dom';
import TypewriterEffect from '../components/TypewriterEffect.jsx';
import GroupForm from '../components/GroupForm.jsx';
import { motion } from 'framer-motion';
import AnimatedFilterButton from '../components/AnimatedFilterButton';
import useFilteredGroups from '../hooks/useFilteredGroups';
import { useSelector } from "react-redux";

export default function MainPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedSport, setSelectedSport] = useState(null);

  const [regionOptions, setRegionOptions] = useState(["전체"]); // ✅ 백엔드 데이터로 대체
  const [sportOptions, setSportOptions] = useState([]);        // ✅ 백엔드 데이터로 대체

  // 로그인 인증
  const isLoggedIn = useSelector(state => state.auth.isAuthenticated);
  const navigate = useNavigate();

  // 검색 관련
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    setSearchQuery(searchText);
  };

  // ✅ 백엔드에서 지역 & 종목 불러오기
  useEffect(() => {
    fetch("/api/regions")
      .then(res => res.json())
      .then(data => setRegionOptions(["전체", ...data.map(r => r.regionName)]));

    fetch("/api/sports")
      .then(res => res.json())
      .then(data => setSportOptions(data.map(s => s.sportName)));
  }, []);

  // ✅ 임시 더미 데이터 (모임 API 연결 전까지 유지)
  const dummyGroups = [
    { id: 1, name: '아침마다 함께 뛰어요! 러닝 크루', region: '강남구', sport: '러닝', currentMembers: 5, maxMembers: 10, imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop', recommended: true },
    { id: 2, name: '주말 저녁 농구 한판 하실 분?', region: '관악구', sport: '농구', currentMembers: 8, maxMembers: 12, imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1974&auto=format&fit=crop', recommended: true },
    { id: 3, name: '볼링 초보 모여라! ', region: '강동구', sport: '볼링', currentMembers: 3, maxMembers: 8, imageUrl: 'https://images.unsplash.com/photo-1551500357-f50395bb3f75?q=80&w=2070&auto=format&fit=crop', recommended: false },
    { id: 4, name: '한강 자전거 라이딩 모임', region: '종로구', sport: '자전거', currentMembers: 12, maxMembers: 20, imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop', recommended: false },
  ];

  // ✅ 필터링 (기존 훅 그대로 사용)
  const filteredGroups = useFilteredGroups(dummyGroups, {
    region: selectedRegion,
    sport: selectedSport,
    searchText: searchQuery,
  });

  const recommendedGroups = filteredGroups.filter(group => group.recommended);

  const typewriterWords = sportOptions.map(sport => ({ word: sport }));

  return (
    <motion.main className="main-container">
      {/* 키워드 애니메이션 */}
      <motion.section className="focus-keywords-section">
        <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2c3e50' }}>
          오늘&nbsp;
          <TypewriterEffect
            words={typewriterWords}
            typingSpeed={150}
            deletingSpeed={100}
            pauseDuration={4000}
            textColor="#2f71ff"
            cursorColor="#2f71ff"
          />
          &nbsp;어때요?
        </span>
      </motion.section>

      {/* 필터 */}
      <motion.section className="filter-section">
        <div className="filters">
          <AnimatedFilterButton buttonText="지역" options={regionOptions} onSelect={setSelectedRegion} />
          <AnimatedFilterButton buttonText="종목 선택" options={sportOptions} onSelect={setSelectedSport} />

          <input
            type="text"
            placeholder="모임 이름으로 검색"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>찾기</button>
        </div>

        <button
          className="create-group-btn"
          onClick={() => {
            if (!isLoggedIn) {
              alert("로그인이 필요합니다.");
              navigate("/login");
            } else {
              setIsModalOpen(true);
            }
          }}
        >
          모임 모집하기
        </button>
      </motion.section>

      {/* 추천 모임 */}
      <motion.section className="group-list-section">
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
      <motion.section className="group-list-section">
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
