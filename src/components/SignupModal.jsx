// src/components/SignupCompleteModal.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import '../assets/Modal.css';

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
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않음
        style={{
          backgroundColor: '#fff',
          border: 'none',
          padding: '30px',
          borderRadius: '12px',
          maxWidth: '400px',
          textAlign: 'center',
        }}
      >
        {/* 문구 영역 */}
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{
            fontSize: '24px',    // 회원가입 완료 제목 크기
            fontWeight: 'bold',
            marginBottom: '12px',
          }}>
            회원가입 완료
          </h2>
          <p style={{
            fontSize: '18px',    // 성공 문구 크기
            margin: 0,
          }}>
            성공적으로 가입되었습니다.
          </p>
        </div>

        {/* 로그인 페이지로 이동 버튼 */}
        <div>
          <button 
            onClick={handleNavigate}
            style={{
              backgroundColor: '#3CD0B5',
              color: '#fff',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px', // 버튼 크기 줄임
              cursor: 'pointer',
              fontSize: '16px',    // 글자 크기 적당히
            }}
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupCompleteModal;
