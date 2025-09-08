import React, { useState } from "react";
import Modal from "../components/Modal"; // 모달 컴포넌트 import

export default function Signup() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  // 가입 성공 시 모달 열기
  const handleSignupSuccess = () => {
    setModalContent({
      title: "가입 완료",
      message: "회원가입이 성공적으로 완료되었습니다!",
    });
    setIsModalOpen(true);
  };

  // 신청 성공 시 모달 열기
  const handleApplicationSuccess = () => {
    setModalContent({
      title: "신청 완료",
      message: "모임 신청이 성공적으로 완료되었습니다!",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  // 예시: 가입 버튼 클릭 시 handleSignupSuccess 호출
  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: 실제 회원가입 로직 구현
    handleSignupSuccess(); // 성공 시 모달 열기
  };

  // 예시: 신청 버튼 클릭 시 handleApplicationSuccess 호출
  const handleApply = () => {
    // TODO: 실제 신청 로직 구현
    handleApplicationSuccess();
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        {/* input, label 등 회원가입 폼 */}
        <button type="submit">회원가입</button>
      </form>

      <button onClick={handleApply}>모임 신청</button>

      {/* 모달 */}
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
