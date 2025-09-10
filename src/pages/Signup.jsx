// src/pages/Signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../redux/authSlice";
import SignupModal from "../components/SignupModal"; // 수정된 모달 import
import '../assets/signup.css';
import '../assets/Modal.css'; // 기존 모달 CSS 그대로 사용

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nickname: "",
    birthdate: "",
    profileImage: null,
  });
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData({ ...formData, profileImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (users[formData.username]) {
      alert("이미 존재하는 아이디입니다.");
    } else {
      const imageUrl = formData.profileImage ? URL.createObjectURL(formData.profileImage) : '/public/mymelody.png';
      dispatch(signup({
        ...formData,
        profileImage: imageUrl,
      }));
      setShowModal(true);
    }
  };

  // 모달을 닫고 로그인 페이지로 이동
  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <div>
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSignup}>
        <input type="text" id="username" name="username" placeholder="아이디" onChange={handleChange} required />

        <input type="password" id="password" name="password" placeholder="비밀번호" onChange={handleChange} required />

        <input type="text" id="nickname" name="nickname" placeholder="닉네임" onChange={handleChange} required />

        <label htmlFor="birthdate">생년월일</label>
        <input type="date" id="birthdate" name="birthdate" onChange={handleChange} required />

        <label htmlFor="profileImage" style={{fontSize: '14px', color: '#555'}}>프로필 이미지</label>
        <input type="file" id="profileImage" name="profileImage" onChange={handleChange} accept="image/*" />

        <button type="submit">회원가입</button>
      </form>

      <p>이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>

      {/* 회원가입 완료 모달 */}
    </div>
      <SignupModal
        show={showModal}
        onClose={handleCloseModal}
        message="성공적으로 가입되었습니다."
      >
        <button style={{ marginTop: '10px' }}>로그인 페이지로 이동</button>
      </SignupModal>
    </div>
  );
}