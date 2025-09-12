import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { joinGroup } from "../redux/groupSlice";
import '../assets/Group/GroupDetail.css';
import axios from "axios";

export default function GroupDetail() {
  const { id: groupId } = useParams(); 
  const [group, setGroup] = useState(null);
  const [schedules, setSchedules] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    location: '',
    meetingTime: '',
    description: ''
  });

  const { user: currentUser, token } = useSelector(state => state.auth);

  const isLeader = currentUser?.nickname === group?.leaderNickname;

  useEffect(() => {
    const fetchGroupDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/groups/${groupId}`);
        setGroup(response.data);
        setSchedules(response.data.schedules);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch group details:", err);
        setError("모임 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetail();
  }, [groupId]);

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule(prev => ({ ...prev, [name]: value }));
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!newSchedule.location || !newSchedule.meetingTime) {
      alert('장소와 시간은 필수입니다.');
      return;
    }

    try {
      const response = await axios.post(`/api/groups/${groupId}/schedules`, newSchedule, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchedules(prev => [...prev, response.data]);
      setIsModalOpen(false);
      setNewSchedule({ location: '', meetingTime: '', description: '' });
      alert('새로운 일정이 등록되었습니다.');
    } catch (err) {
      console.error('Failed to create schedule:', err);
      alert(err.response?.data?.message || '일정 생성에 실패했습니다.');
    }
  };

  const handleJoinClick = async () => {
    const isLoggedIn = !!currentUser;
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

  const formatDateTime = (dateTimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTimeString).toLocaleDateString('ko-KR', options);
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
          <p><strong>지역:</strong> {group.regionName} | <strong>종목:</strong> {group.sportName}</p>
          <p><strong>참여 인원:</strong> {group.currentMembers} / {group.maxMembers}명</p>
          <button className="join-btn" onClick={handleJoinClick}>참여하기</button>
        </div>
      </div>

      <section className="group-schedules">
        <div className="schedule-header">
          <h3>모임 일정</h3>
          {/* 모임장일 경우에만 '일정 추가' 버튼 표시 */}
          {isLeader && (
            <button className="add-schedule-btn" onClick={() => setIsModalOpen(true)}>
              일정 추가
            </button>
          )}
        </div>

        {schedules.length > 0 ? (
          <ul className="schedule-list">
            {schedules.map(schedule => (
              <li key={schedule.scheduleId} className="schedule-item">
                <p><strong>시간:</strong> {formatDateTime(schedule.meetingTime)}</p>
                <p><strong>장소:</strong> {schedule.location}</p>
                {schedule.description && <p className="description">{schedule.description}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p>등록된 일정이 아직 없습니다.</p>
        )}
      </section>
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>새 일정 등록</h3>
            <form onSubmit={handleScheduleSubmit}>
              <input type="text" name="location" placeholder="모임 장소" value={newSchedule.location} onChange={handleScheduleChange} required />
              <input type="datetime-local" name="meetingTime" value={newSchedule.meetingTime} onChange={handleScheduleChange} required />
              <textarea name="description" placeholder="일정에 대한 간단한 설명 (선택)" value={newSchedule.description} onChange={handleScheduleChange}></textarea>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)}>취소</button>
                <button type="submit">생성하기</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}