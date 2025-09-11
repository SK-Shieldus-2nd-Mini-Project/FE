import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('accessToken'); // JWT 토큰
  
  useEffect(() => {
    if (!token) return;
    

    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
          params: { t: Date.now() } // 캐시 방지
        });

        // API에서 내려주는 배열 확인 후 상태에 저장
        const filteredUsers = Array.isArray(res.data)
          ? res.data.map(user => ({
              username: user.username,
              nickname: user.nickname,
              role: user.role
            }))
          : [];

        setUsers(filteredUsers);
      } catch (err) {
        console.error('API Error:', err);
        setError('사용자 목록을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  // 계정 삭제
  const handleDelete = async (username) => {
    if (username === 'admin') {
      alert('관리자 계정은 삭제할 수 없습니다.');
      return;
    }

    try {
      await axios.delete(`/api/admin/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(prev => prev.filter(user => user.username !== username));
      alert(`${username} 회원을 삭제 처리했습니다.`);
    } catch (err) {
      console.error(err);
      alert('회원 삭제에 실패했습니다.');
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-tab-content">
      <h3>전체 회원 관리</h3>
      {users.length === 0 ? (
        <p>등록된 사용자가 없습니다.</p>
      ) : (
        <ul className="data-list">
          {users.map(user => (
            <li key={user.username} className="data-list-item">
              <div className="item-info">
                <span className="item-title">{user.nickname} ({user.username})</span>
                <span className="item-detail">역할: {user.role}</span>
              </div>
              <div className="item-actions">
                <button className="edit-btn">정보 수정</button>
                <button className="delete-btn" onClick={() => handleDelete(user.username)}>계정 삭제</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}