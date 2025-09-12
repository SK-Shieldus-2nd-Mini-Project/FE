import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../assets/MyPage/ManageRecruitment.css';

// [추가] 승인 상태 스타일
const getStatusStyle = (status) => {
    switch (status) {
        case 'APPROVED':
            return { backgroundColor: '#2ecc71', color: 'white' };
        case 'REJECTED':
            return { backgroundColor: '#e74c3c', color: 'white' };
        case 'PENDING':
        default:
            return { backgroundColor: '#f39c12', color: 'white' };
    }
};

export default function ManageRecruitment() {
    const [myGroups, setMyGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);

    // [변경] 수정폼 상태 (모달 대신)
    const [editForm, setEditForm] = useState({ groupName: "", description: "", maxMembers: "" });
    const [isEditing, setIsEditing] = useState(false);

    const token = useSelector(state => state.auth.token);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const fetchGroups = async () => {
            try {
                const res = await axios.get('/api/users/me/groups', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const leaderGroups = res.data.filter(group => group.leader);
                setMyGroups(leaderGroups);
            } catch (err) {
                console.error('API Error:', err);
                setError('데이터를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, [token]);

    const fetchApplicants = async (group) => {
        setSelectedGroup(group);
        setIsEditing(false); // 기본은 수정 모드 아님
        try {
            const res = await axios.get(`/api/groups/${group.groupId}/applicants`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplicants(res.data);
        } catch (err) {
            alert('신청자 목록을 불러오는 데 실패했습니다.');
            setApplicants([]);
        }
    };

    const handleApprove = async (userId) => {
        if (!window.confirm('가입을 승인하시겠습니까?')) return;
        try {
            await axios.post(`/api/groups/${selectedGroup.groupId}/applicants/${userId}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('승인 처리되었습니다.');
            setApplicants(prev => prev.filter(app => app.userId !== userId));
        } catch (err) {
            alert('승인 처리에 실패했습니다.');
        }
    };

    const handleReject = async (userId) => {
        if (!window.confirm('가입을 거절하시겠습니까?')) return;
        try {
            await axios.post(`/api/groups/${selectedGroup.groupId}/applicants/${userId}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('거절 처리되었습니다.');
            setApplicants(prev => prev.filter(app => app.userId !== userId));
        } catch (err) {
            alert('거절 처리에 실패했습니다.');
        }
    };

    // 수정 모드 진입
    const startEdit = (group) => {
        setEditForm({
            groupName: group.groupName || "",
            description: group.description || "",
            maxMembers: group.maxMembers || ""
        });
        setIsEditing(true);
    };

    // 수정 폼 입력 변경
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    // 수정 요청
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/groups/${selectedGroup.groupId}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('모임 정보가 수정되었습니다.');

            // 내 그룹 목록 다시 불러오기
            const res = await axios.get('/api/users/me/groups', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyGroups(res.data.filter(group => group.leader));

            // 선택된 그룹도 업데이트
            setSelectedGroup(prev => ({ ...prev, ...editForm }));

            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert('모임 수정에 실패했습니다.');
        }
    };

    // 삭제 요청
    const handleDelete = async () => {
        if (!window.confirm("정말 이 모임을 삭제하시겠습니까?")) return;

        try {
            await axios.delete(`/api/groups/${selectedGroup.groupId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('모임이 삭제되었습니다.');

            // 그룹 목록에서 제거
            setMyGroups(prev => prev.filter(g => g.groupId !== selectedGroup.groupId));

            // 선택된 그룹/신청자 초기화
            setSelectedGroup(null);
            setApplicants([]);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("모임 삭제에 실패했습니다.");
        }
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="content-panel">
            <h2>모집 활동 관리</h2>
            <p>내가 만든 모임의 가입 신청자들을 관리할 수 있습니다.</p>

            <div className="recruitment-container">
                <div className="my-groups-list">
                    <h4>내 모임 목록</h4>
                    {myGroups.length === 0 ? (
                        <p>생성한 모임이 없습니다.</p>
                    ) : (
                        myGroups.map(group => (
                            <div key={group.groupId} className="my-group-item-detailed">
                                <div className="group-item-header">
                                    <span className="group-item-name">{group.groupName}</span>
                                    <span className="status-badge" style={getStatusStyle(group.approvalStatus)}>
                                        {group.approvalStatus}
                                    </span>
                                </div>
                                <div className="group-item-info">
                                    <span><strong>지역:</strong> {group.regionName}</span>
                                    <span><strong>종목:</strong> {group.sportName}</span>
                                </div>
                                {group.approvalStatus === 'APPROVED' && (
                                    <>
                                        <button className="groupmembers-btn" onClick={() => fetchApplicants(group)}>신청자 보기</button>
                                        <button className="modify-btn" onClick={() => { fetchApplicants(group); startEdit(group); }}>모임 수정하기</button>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="applicants-list">
                    <h4>
                        {selectedGroup ? `"${selectedGroup.groupName}" 상세` : "가입 신청자 / 모임 정보"}
                    </h4>

                    {!selectedGroup && <p>모임을 선택하여 신청자나 수정 화면을 확인하세요.</p>}

                    {selectedGroup && isEditing && (
                        <form onSubmit={handleEditSubmit} className="edit-form">
                            <label>
                                모임 이름:
                                <input
                                    type="text"
                                    name="groupName"
                                    value={editForm.groupName}
                                    onChange={handleEditChange}
                                    required
                                />
                            </label>
                            <label>
                                설명:
                                <textarea
                                    name="description"
                                    value={editForm.description}
                                    onChange={handleEditChange}
                                />
                            </label>
                            <label>
                                최대 인원:
                                <input
                                    type="number"
                                    name="maxMembers"
                                    value={editForm.maxMembers}
                                    onChange={handleEditChange}
                                    required
                                />
                            </label>
                            <div className="edit-actions">
                                <button type="button" className="delete-btn" onClick={handleDelete}>삭제</button>
                                <button type="submit">저장</button>
                                <button type="button" onClick={() => setIsEditing(false)}>취소</button>
                            </div>
                        </form>
                    )}

                    {selectedGroup && !isEditing && (
                        <>
                            {applicants.length === 0 && <p>가입 신청자가 없습니다.</p>}
                            {applicants.map(applicant => (
                                <div key={applicant.userId} className="applicant-item">
                                    <div className="applicant-info">
                                        <img src={applicant.profileImageUrl || '/mymelody.png'} alt="profile" />
                                        <span>{applicant.nickname}</span>
                                    </div>
                                    <div className="applicant-actions">
                                        <button className="approve" onClick={() => handleApprove(applicant.userId)}>승인</button>
                                        <button className="reject" onClick={() => handleReject(applicant.userId)}>거절</button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}