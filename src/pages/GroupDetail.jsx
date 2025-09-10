import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { applyToGroup } from "../redux/applicationSlice";
import '../assets/Group/GroupDetail.css';

export default function GroupDetail() {
  const { id } = useParams(); // URL에서 모임 id 가져오기
  const [group, setGroup] = useState(null);
  const navigate = useNavigate();
  
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isAuthenticated);
  const currentUser = useSelector(state => state.auth.user);

  useEffect(() => {
    // 임시 데이터
    const dummyGroups = [
      {
        id: 1,
        name: '아침마다 함께 뛰어요! 조깅 크루',
        region: '강남구',
        sport: '조깅',
        currentMembers: 5,
        maxMembers: 10,
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop',
        description: '건강한 아침 루틴을 함께 할 조깅 모임입니다.',
      },
      {
        id: 2,
        name: '주말 저녁 농구 한판 하실 분?',
        region: '관악구',
        sport: '농구',
        currentMembers: 8,
        maxMembers: 12,
        imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1974&auto=format&fit=crop',
        description: '주말 저녁 농구로 스트레스 풀고 싶은 분들을 모십니다.',
      },
      {
        id: 3,
        name: '볼링 초보 모여라!',
        region: '강동구',
        sport: '볼링',
        currentMembers: 3,
        maxMembers: 8,
        imageUrl: 'https://images.unsplash.com/photo-1551500357-f50395bb3f75?q=80&w=2070&auto=format&fit=crop',
        description: '주말에 함께 볼링하실 분들 모십니다.',
      },
      {
        id: 4,
        name: '한강 자전거 라이딩 모임',
        region: '종로구',
        sport: '자전거',
        currentMembers: 12,
        maxMembers: 20,
        imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop',
        description: '라이딩 초보자를 위한 안전한 라이딩 모임입니다.',
      }
    ];

    const foundGroup = dummyGroups.find(g => g.id === parseInt(id));
    setGroup(foundGroup);
  }, [id]);

  //로그인 확인 
  const handleJoinClick = () => {
    if (!isLoggedIn) {
      // modal로 변경
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
    // modal로 변경
    else {
      alert(`${currentUser.nickname}님, "${group.name}" 모임에 참가 신청되었습니다!`);
      dispatch(applyToGroup({ groupId: group.id, groupName: group.name }));
      navigate("/mypage");
    }
  }

  if (!group) return <p>로딩 중...</p>;

  return (
    <div className="group-detail-container">
      <Link to="/" className="back-btn">← 홈으로 가기</Link>

      <div className="group-header">
        <img src={group.imageUrl} alt={group.name} />
        <div className="group-header-info">
          <h2>{group.name}</h2>
          <p>{group.description}</p>
          <p><strong>지역:</strong> {group.region} | <strong>종목:</strong> {group.sport}</p>
          <p><strong>참여 인원:</strong> {group.currentMembers} / {group.maxMembers}명</p>
          <button className="join-btn" onClick={handleJoinClick}>참여하기</button>
        </div>
      </div>

      <section className="group-posts">
        <h3>게시글</h3>
        <p>게시글이 아직 없습니다.</p>
      </section>
    </div>
  );
}