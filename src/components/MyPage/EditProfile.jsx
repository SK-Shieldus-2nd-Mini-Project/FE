import React, { useState } from 'react';
import '../../assets/MyPage/EditProfile.css'; // EditProfile 전용 CSS 파일을 import

export default function EditProfile() {
  // 현재 사용자 정보 (API 연동 전 임시 데이터)
  const [userInfo, setUserInfo] = useState({
    nickname: '운동매니아',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileImage, setProfileImage] = useState('/public/mymelody.png');
  const [newProfileImageFile, setNewProfileImageFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfileImageFile(file); // 파일 객체를 상태에 저장
      setProfileImage(URL.createObjectURL(file)); // 미리보기 URL 생성
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInfo.newPassword !== userInfo.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    console.log('수정된 정보:', { ...userInfo, profileImage: newProfileImageFile });
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
            value={userInfo.nickname}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="currentPassword">현재 비밀번호</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            placeholder="현재 비밀번호를 입력하세요"
            value={userInfo.currentPassword}
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
            value={userInfo.newPassword}
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
            value={userInfo.confirmPassword}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-actions">
            <button type="submit" className="save-button">저장</button>
            <button type="button" className="cancel-button">취소</button>
        </div>
      </form>
    </div>
  );
}