import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../assets/MyPage/ManageRecruitment.css';

// [추가] 승인 상태에 따른 스타일을 반환하는 함수
const getStatusStyle = (status) => {
    switch (status) {
        case 'APPROVED':
            return { backgroundColor: '#2ecc71', color: 'white' }; // 초록
        case 'REJECTED':
            return { backgroundColor: '#e74c3c', color: 'white' }; // 빨강
        case 'PENDING':
        default:
            return { backgroundColor: '#f39c12', color: 'white' }; // 주황
    }
};


export default function ManageRecruitment() {
    const [myGroups, setMyGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null); // [수정] ID 대신 그룹 객체 전체를 저장

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
        setSelectedGroup(group); // [수정] 선택된 그룹 객체를 저장
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
                                 {/* [수정] 승인된 모임일 경우에만 신청자 보기 버튼 활성화 */}
                                {group.approvalStatus === 'APPROVED' && (
                                    <button onClick={() => fetchApplicants(group)}>
                                        신청자 보기
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="applicants-list">
                    <h4>{selectedGroup ? `"${selectedGroup.groupName}" 가입 신청자` : "가입 신청자"}</h4>
                    {!selectedGroup && <p>모임을 선택하여 신청자를 확인하세요.</p>}
                    {selectedGroup && applicants.length === 0 && <p>가입 신청자가 없습니다.</p>}
                    {applicants.map(applicant => (
                        <div key={applicant.userId} className="applicant-item">
                            <div className="applicant-info">
                                <img src={applicant.profileImageUrl || '/public/mymelody.png'} alt="profile" />
                                <span>{applicant.nickname}</span>
                            </div>
                            <div className="applicant-actions">
                                <button className="approve" onClick={() => handleApprove(applicant.userId)}>승인</button>
                                <button className="reject" onClick={() => handleReject(applicant.userId)}>거절</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}