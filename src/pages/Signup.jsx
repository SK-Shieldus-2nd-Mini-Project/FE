import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { signupUser } from "../redux/authSlice"; // Thunk 액션 import
import SignupModal from "../components/modals/SignupModal";
import '../assets/signup.css';
import '../assets/modals/Modal.css';

const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nickname: "",
    birthdate: "",
    // profileImage는 현재 백엔드에서 처리하지 않으므로 제외
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      // ✅ 파일 자체를 state에 저장
      setProfileImageFile(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // ✅ formData와 파일 객체를 함께 넘겨줌
      await dispatch(signupUser({ ...formData, profileImageFile })).unwrap();
      setShowModal(true);
    } catch (error) {
      alert(error.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <div>
    <motion.div 
    className="signup-container"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    >
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
    </motion.div>
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