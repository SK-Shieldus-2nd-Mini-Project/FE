import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import '../assets/signup.css';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nickname: "",
    birthdate: "",
    profileImage: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData({ ...formData, profileImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSignupSuccess = () => {
    setModalContent({
      title: "가입 완료",
      message: "회원가입이 성공적으로 완료되었습니다!",
    });
    setIsModalOpen(true);
  };

  const handleApplicationSuccess = () => {
    setModalContent({
      title: "신청 완료",
      message: "모임 신청이 성공적으로 완료되었습니다!",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSignup = (event) => {
    event.preventDefault();
    // TODO: 실제 회원가입 로직 구현
    handleSignupSuccess();
  };

  const handleApply = () => {
    // TODO: 실제 신청 로직 구현
    handleApplicationSuccess();
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSignup}>
        <input type="text" name="username" placeholder="아이디" value={formData.username} onChange={handleChange} required />
        <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required />
        <input type="text" name="nickname" placeholder="닉네임" value={formData.nickname} onChange={handleChange} required />
        <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} required />
        <input type="file" name="profileImage" onChange={handleChange} accept="image/*" />
        <button type="submit">회원가입</button>
      </form>

      <p>이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>

      <button onClick={handleApply}>모임 신청</button>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={modalContent.title}
          message={modalContent.message}
        />
      )}
    </div>
  );
}
