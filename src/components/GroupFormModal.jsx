// src/components/GroupFormModal.jsx
import React from "react";
import '../assets/Modal.css'; // 공통 CSS 사용

const GroupFormModal = ({ show, onClose, message }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          border: 'none',
          padding: '30px',
          borderRadius: '12px',
          textAlign: 'center', // 전체 중앙 정렬
        }}
      >
        {/* 문구 영역 */}
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{
            fontSize: '24px',    // 제목 글자 크기
            fontWeight: 'bold',
            marginBottom: '12px',
          }}>
            모임 생성 완료
          </h2>
          <p style={{
            fontSize: '18px',    // 메시지 글자 크기
            margin: 0,
          }}>
            {message}
          </p>
        </div>

        {/* 확인 버튼 영역 */}
        <div>
          <button 
            onClick={onClose}
            style={{
              backgroundColor: '#3CD0B5', // 버튼 색상
              color: '#fff',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer',
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupFormModal;