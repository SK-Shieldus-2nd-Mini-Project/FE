import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/MainPage.css'; // MainPage를 위한 CSS 파일을 import 합니다.
import TrueFocus from '../components/TrueFocus.jsx';

// 임시 데이터 (나중에 API로 받아올 데이터)
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
    fontSize: "3rem", // 폰트 크기를 키움
    fontWeight: "bold",
    fontFamily: "'KakaoSmallSans-Bold', sans-serif", // 적용된 폰트 사용
};

export default function MainPage() {
  const recommendedGroups = dummyGroups.filter(group => group.recommended);
  const allGroups = dummyGroups;

  return (
    <main className="main-container">
      <section className="focus-keywords-section">
        <TrueFocus 
          text="런닝 자전거 축구"
          manualMode={false} // 자동 순환 모드
          blurAmount={3}
          borderColor="#3498db"
          glowColor="rgba(52, 152, 219, 0.6)"
          animationDuration={0.4}
          pauseBetweenAnimations={1.5} // 애니메이션 사이 1.5초 대기
          textColor="#2c3e50"
          textAlign="center"
          font={focusFont}
        />
      </section>

      {/* --- 필터링 및 검색 섹션 --- */}
      <section className="filter-section">
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
        <Link to="/create-group" className="create-group-btn">
          모임 모집하기
        </Link>
      </section>

      {/* --- 추천 모임 섹션 --- */}
      <section className="group-list-section">
        <h2>추천 모임</h2>
        <div className="group-grid">
          {recommendedGroups.map((group) => (
            <Link to={`/group/${group.id}`} key={group.id} className="group-card">
              <img src={group.imageUrl} alt={group.name} />
              <div className="group-info">
                <h3>{group.name}</h3>
                <p># {group.region} # {group.sport}</p>
                <span>{group.currentMembers} / {group.maxMembers}명</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* --- 전체 모임 섹션 --- */}
      <section className="group-list-section">
        <h2>전체 모임</h2>
        <div className="group-grid">
          {allGroups.map((group) => (
            <Link to={`/group/${group.id}`} key={group.id} className="group-card">
              <img src={group.imageUrl} alt={group.name} />
              <div className="group-info">
                <h3>{group.name}</h3>
                <p># {group.region} # {group.sport}</p>
                <span>{group.currentMembers} / {group.maxMembers}명</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}