import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { joinGroup } from "../redux/groupSlice";
import '../assets/Group/GroupDetail.css';
import axios from "axios";

export default function GroupDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // URL에서 모임 id 가져오기
  const [group, setGroup] = useState(null);
  const navigate = useNavigate();
  
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isAuthenticated);
  const currentUser = useSelector(state => state.auth.user);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchGroupDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/groups/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGroup(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch group details:", err);
        setError("모임 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetail();
  }, [id, token]);

  //로그인 확인 
  const handleJoinClick = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    
    try {
      await dispatch(joinGroup(group.groupId)).unwrap();
      alert(`"${group.groupName}" 모임에 참가 신청되었습니다!`);
      navigate("/mypage");
    } catch (error) {
      alert(error.message || '가입 신청에 실패했습니다.');
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!group) return <p>모임 정보를 찾을 수 없습니다.</p>;

  return (
    <div className="group-detail-container">
      <Link to="/" className="back-btn">← 홈으로 가기</Link>

      <div className="group-header">
        <img src={'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop'} alt={group.groupName} />
        <div className="group-header-info">
          <h2>{group.groupName}</h2>
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