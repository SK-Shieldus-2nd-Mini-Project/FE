import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../assets/MyPage/MyActivities.css';
import { useNavigate } from 'react-router-dom';

const getStatusInfo = (application) => {
    if (application.leader) {
        return { text: '모임장', className: 'leader' };
    }
    switch (application.status) {
        case 'APPROVED':
            return { text: '승인 완료', className: 'approved' };
        case 'REJECTED':
            return { text: '승인 거절', className: 'rejected' };
        case 'PENDING':
        default:
            return { text: '승인 대기', className: 'pending' };
    }
};

export default function MyActivities() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = useSelector(state => state.auth.token);

    const navigate = useNavigate();
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const fetchApplications = async () => {
            try {
                const res = await axios.get('/api/users/me/applications', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setApplications(res.data);
            } catch (err) {
                console.error('Failed to fetch applications:', err);
                setError('활동 내역을 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [token]);

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;

     return (
        <div className="content-panel">
            <h2>내 활동</h2>
            <p>내가 만들었거나 가입 신청한 모임의 현황을 확인합니다.</p>
            {applications.length === 0 ? (
                <p className="no-activities">아직 활동 내역이 없습니다.</p>
            ) : (
                <ul className="status-list">
                    {applications.map((app) => {
                        const statusInfo = getStatusInfo(app); // [수정] app 객체 전체를 전달
                        return (
                          <li
                            key={app.groupId}
                            className={`status-${statusInfo.className}`}
                            onClick={() => navigate(`/groups/${app.groupId}`)}
                            style={{ cursor: 'pointer' }}
                          >
                            <span className="group-name">{app.groupName}</span>
                            <span className="status-badge">{statusInfo.text}</span>
                          </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}