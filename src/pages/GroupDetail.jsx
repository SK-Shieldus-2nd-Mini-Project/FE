import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { joinGroup } from "../redux/groupSlice";
import '../assets/Group/GroupDetail.css';
import '../assets/modals/GroupFormModal.css'
import axios from "axios";

export default function GroupDetail() {
  const { id: groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    location: '',
    meetingTime: '',
    description: ''
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const { user: currentUser, token } = useSelector(state => state.auth);
  const isLeader = currentUser?.userId === group?.leaderInfo?.userId;

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
      setIsCreateModalOpen(false);
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

  const openEditModal = (schedule) => {
    setEditingSchedule({ ...schedule, meetingTime: schedule.meetingTime.slice(0, 16) }); // 'YYYY-MM-DDTHH:mm' 형식으로 변환
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditingSchedule(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    if (!editingSchedule.location || !editingSchedule.meetingTime) {
      alert('장소와 시간은 필수입니다.');
      return;
    }

    const updateData = {
      location: editingSchedule.location,
      meetingTime: editingSchedule.meetingTime,
      description: editingSchedule.description,
    };

    try {
      await axios.put(`/api/groups/${groupId}/schedules/${editingSchedule.scheduleId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // 화면의 일정 목록 상태 업데이트
      setSchedules(prev => prev.map(s => s.scheduleId === editingSchedule.scheduleId ? { ...s, ...editingSchedule, meetingTime: editingSchedule.meetingTime + ":00" } : s));
      setIsEditModalOpen(false);
      setEditingSchedule(null);
      alert('일정이 성공적으로 수정되었습니다.');
    } catch (err) {
      console.error('Failed to update schedule:', err);
      alert(err.response?.data?.message || '일정 수정에 실패했습니다.');
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('정말로 이 일정을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/api/groups/${groupId}/schedules/${scheduleId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // 화면의 일정 목록에서 삭제된 항목 제거
        setSchedules(prev => prev.filter(s => s.scheduleId !== scheduleId));
        alert('일정이 삭제되었습니다.');
      } catch (err) {
        console.error('Failed to delete schedule:', err);
        alert(err.response?.data?.message || '일정 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!group) return <p>모임 정보를 찾을 수 없습니다.</p>;

  return (
    // [수정] 전체를 감싸는 div 추가
    <div className="group-detail-container">
      <Link to="/" className="back-btn">←</Link>
      
      {/* 메인 반투명 컨테이너 */}
      <div className="detail-content-wrapper">
        <div className="group-detail-main-content">
          <div className="group-header">
            <img src={group.imageUrl || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop'} alt={group.groupName} />
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
          {isLeader && (
            <button className="add-schedule-btn" onClick={() => setIsCreateModalOpen(true)}>
              일정 추가
            </button>
          )}
        </div>

        {schedules.length > 0 ? (
          <ul className="schedule-list">
            {schedules.map(schedule => (
              <li key={schedule.scheduleId} className="schedule-item">
                <div>
                  <p><strong>시간:</strong> {formatDateTime(schedule.meetingTime)}</p>
                  <p><strong>장소:</strong> {schedule.location}</p>
                  {schedule.description && <p className="description">{schedule.description}</p>}
                </div>
                {/* [추가] 모임장에게만 수정/삭제 버튼 표시 */}
                {isLeader && (
                  <div className="schedule-actions">
                    <button onClick={() => openEditModal(schedule)}>수정</button>
                    <button className="delete" onClick={() => handleDeleteSchedule(schedule.scheduleId)}>삭제</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>등록된 일정이 아직 없습니다.</p>
        )}
      </section>
      </div>
      <aside className="group-members-sidebar">
        <h4>멤버 목록</h4>
        <ul className="members-list">
          {/* 모임장 표시 */}
          {group.leaderInfo && (
            <li className="member-item leader">
              <img src={group.leaderInfo.profileImageUrl || '/public/mymelody.png'} alt={group.leaderInfo.nickname} />
              <span>{group.leaderInfo.nickname}</span>
              <span className="detail-leader-badge">모임장</span>
            </li>
          )}
          {/* 멤버 목록 표시 */}
          {group.members && group.members.map(member => (
            <li key={member.userId} className="member-item">
              <img src={member.profileImageUrl || '/public/mymelody.png'} alt={member.nickname} />
              <span>{member.nickname}</span>
            </li>
          ))}
        </ul>
      </aside>
      </div>
      {isCreateModalOpen && (
            <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
                <div className="form-modal-content" onClick={e => e.stopPropagation()}>
                    <h3>새 일정 등록</h3>
            <form onSubmit={handleScheduleSubmit}>
              <input type="text" name="location" placeholder="모임 장소" value={newSchedule.location} onChange={handleScheduleChange} required />
              <input type="datetime-local" name="meetingTime" value={newSchedule.meetingTime} onChange={handleScheduleChange} required />
              <textarea name="description" placeholder="일정에 대한 간단한 설명 (선택)" value={newSchedule.description} onChange={handleScheduleChange}></textarea>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsCreateModalOpen(false)}>취소</button>
                <button type="submit">생성하기</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* [추가] 일정 수정 모달 */}
      {isEditModalOpen && editingSchedule && (
            <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
                <div className="form-modal-content" onClick={e => e.stopPropagation()}>
                    <h3>일정 수정</h3>
            <form onSubmit={handleUpdateSchedule}>
              <input type="text" name="location" placeholder="모임 장소" value={editingSchedule.location} onChange={handleEditFormChange} required />
              <input type="datetime-local" name="meetingTime" value={editingSchedule.meetingTime} onChange={handleEditFormChange} required />
              <textarea name="description" placeholder="일정에 대한 간단한 설명 (선택)" value={editingSchedule.description} onChange={handleEditFormChange}></textarea>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsEditModalOpen(false)}>취소</button>
                <button type="submit">저장하기</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}