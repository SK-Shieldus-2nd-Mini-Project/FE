import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import '../../assets/modals/Modal.css';
import '../../assets/modals/GroupFormModal.css'

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nickname: "",
    birthdate: "",
    profileImageUrl: "",
    password: "",
    role: "USER",
  });

  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchUsers();
  }, [token]);

    const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError('사용자 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 계정 삭제
  const handleDelete = async (userId, nickname) => {
    if (window.confirm(`정말로 '${nickname}' 회원을 탈퇴시키겠습니까?`)) {
        try {
            await axios.delete(`/api/admin/users/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            alert(`${nickname} 회원을 삭제 처리했습니다.`);
            setUsers(prev => prev.filter(user => user.userId !== userId));
          } catch (err) {
            alert('회원 삭제에 실패했습니다.');
          }
    }
  };

  // 수정 버튼 눌렀을 때 모달 열기
  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      nickname: user.nickname || "",
      // birthdate는 YYYY-MM-DD 형식으로 변환해야 input[type="date"]에 표시됩니다.
      birthdate: user.birthdate ? new Date(user.birthdate).toISOString().split('T')[0] : "",
      password: "", // 보안을 위해 비밀번호는 비워둡니다.
      role: user.role || "USER",
    });
    setIsEditModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 수정 저장
  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    // 비밀번호가 비어있으면 전송 객체에서 제외
    const updateData = { ...formData };
    if (!updateData.password) {
        delete updateData.password;
    }

    try {
      await axios.put(`/api/admin/users/${editingUser.userId}`, updateData, {
          headers: { Authorization: `Bearer ${token}` }
      });
      alert("회원 정보가 수정되었습니다.");
      setIsEditModalOpen(false);
      setEditingUser(null);
      fetchUsers(); // 목록 새로고침
    } catch (err) {
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
                <button className="edit-btn" onClick={() => openEditModal(user)}>정보 수정</button>
                <button className="delete-btn" onClick={() => handleDelete(user.userId, user.nickname)}>계정 삭제</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 모달 */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="form-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>&times;</button>
            <h3>'{editingUser.nickname}' 정보 수정</h3>
            <form onSubmit={handleSave}>
              <div className="input-field">
                <label htmlFor="nickname">닉네임</label>
                <input type="text" id="nickname" name="nickname" value={formData.nickname} onChange={handleFormChange} />
              </div>
              <div className="input-field">
                <label htmlFor="birthdate">생년월일</label>
                <input type="date" id="birthdate" name="birthdate" value={formData.birthdate} onChange={handleFormChange} />
              </div>
              <div className="input-field">
                <label htmlFor="password">새 비밀번호 (변경 시에만 입력)</label>
                <input type="password" id="password" name="password" placeholder="새 비밀번호" value={formData.password} onChange={handleFormChange} />
              </div>
              <div className="input-field">
                <label htmlFor="role">역할</label>
                <select id="role" name="role" value={formData.role} onChange={handleFormChange}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
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