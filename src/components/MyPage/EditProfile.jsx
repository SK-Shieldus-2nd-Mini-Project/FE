import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../redux/authSlice';
import '../../assets/MyPage/EditProfile.css';

export default function EditProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    nickname: '',
    birthdate: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState('/public/mymelody.png');
  const [newProfileImageFile, setNewProfileImageFile] = useState(null);

  // 컴포넌트 마운트 시 Redux의 사용자 정보로 폼 초기화
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nickname: user.nickname,
        birthdate: user.birthdate,
      }));
      setProfileImage(user.profileImage || '/public/mymelody.png');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfileImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    const imageUrl = newProfileImageFile ? URL.createObjectURL(newProfileImageFile) : profileImage;

    dispatch(updateUser({
      username: user.username,
      nickname: formData.nickname,
      birthdate: formData.birthdate,
      profileImage: imageUrl,
    }));
    
    // TODO: 비밀번호 변경은 별도의 API 호출이 필요함 (현재는 시뮬레이션)
    if (formData.newPassword) {
        console.log("비밀번호 변경 시도:", formData.newPassword);
    }

    alert('회원정보가 성공적으로 수정되었습니다.');
  };

return (
    <div className="content-panel">
      <h2>회원정보 수정</h2>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="form-group profile-image-group">
          <label>프로필 이미지</label>
          <div className="profile-image-preview">
            <img src={profileImage} alt="Profile Preview" />
            <input 
              type="file" 
              id="profileImageUpload" 
              accept="image/*" 
              onChange={handleImageChange} 
            />
            <label htmlFor="profileImageUpload" className="image-upload-button">
              이미지 변경
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="birthdate">생년월일</label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="currentPassword">현재 비밀번호</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            placeholder="비밀번호를 변경할 경우에만 입력하세요"
            value={formData.currentPassword}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">새 비밀번호</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            placeholder="새 비밀번호를 입력하세요"
            value={formData.newPassword}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">새 비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="새 비밀번호를 다시 입력하세요"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-actions">
            <button type="submit" className="save-button">저장하기</button>
            <button type="button" className="cancel-button">취소</button>
        </div>
      </form>
    </div>
  );
}