import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/modals/Modal.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingUser, setEditingUser] = useState(null); // 수정할 사용자 정보
  const [formData, setFormData] = useState({
    nickname: "",
    birthdate: "",
    profileImageUrl: "",
    password: "",
    role: "",
  });

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
          params: { t: Date.now() }
        });

        const filteredUsers = Array.isArray(res.data)
          ? res.data.map(user => ({
            userId: user.userId,
            username: user.username,
            nickname: user.nickname,
            role: user.role,
            birthdate: user.birthdate,
            profileImageUrl: user.profileImageUrl
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
  const handleDelete = async (userId, username) => {
    if (username === 'admin') {
      alert('관리자 계정은 삭제할 수 없습니다.');
      return;
    }

    try {
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(prev => prev.filter(user => user.userId !== userId));
      alert(`${username} 회원을 삭제 처리했습니다.`);
    } catch (err) {
      console.error(err);
      alert('회원 삭제에 실패했습니다.');
    }
  };

  // 수정 버튼 눌렀을 때 모달 열기
  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      nickname: user.nickname || "",
      birthdate: user.birthdate || "",
      profileImageUrl: user.profileImageUrl || "",
      password: "",
      role: user.role || "USER",
    });
  };

  // 모달 닫기
  const closeEditModal = () => {
    setEditingUser(null);
  };

  // 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 수정 저장
  const handleSave = async () => {
    if (!editingUser) return;

    try {
      const res = await axios.put(`/api/admin/users/${editingUser.userId}`,
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 상태 갱신
      setUsers(prev =>
        prev.map(user =>
          user.userId === editingUser.userId
            ? { ...user, ...res.data }
            : user
        )
      );

      alert("회원 정보가 수정되었습니다.");
      closeEditModal();
    } catch (err) {
      console.error(err);
      alert("회원 수정에 실패했습니다.");
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
            <li key={user.userId} className="data-list-item">
              <div className="item-info">
                <span className="item-title">{user.nickname} ({user.username})</span>
                <span className="item-detail">역할: {user.role}</span>
              </div>
              <div className="item-actions">
                <button
                  className="edit-btn"
                  onClick={() => openEditModal(user)}
                >
                  정보 수정
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(user.userId, user.username)}
                >
                  계정 삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 모달 */}
      {editingUser && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>회원 정보 수정</h3>
            <label>
              닉네임:
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
              />
            </label>
            <label>
              생년월일:
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
              />
            </label>
            <label>
              비밀번호:
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </label>
            <label>
              역할:
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </label>

            <div className="modal-actions">
              <button onClick={handleSave}>저장</button>
              <button onClick={closeEditModal}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}