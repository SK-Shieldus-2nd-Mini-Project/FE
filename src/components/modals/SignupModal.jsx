// src/components/SignupCompleteModal.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import '../../assets/modals/Modal.css';
import '../../assets/modals/SignupModal.css';

const SignupCompleteModal = ({ show, onClose }) => {
  const navigate = useNavigate();

  if (!show) return null;

  const handleNavigate = () => {
    navigate("/login"); // 로그인 페이지로 이동
    onClose();           // 모달 닫기
  };

  return (
    <div className="modal-overlay" onClick={handleNavigate}>
      <div 
        className="signup-modal-content" 
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않음
      >
        {/* 문구 영역 */}
        <div>
          <h2>
            회원가입 완료
          </h2>
          <p>
            성공적으로 가입되었습니다.
          </p>
        </div>

        {/* 로그인 페이지로 이동 버튼 */}
        <div>
          <button 
            onClick={handleNavigate}
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupCompleteModal;