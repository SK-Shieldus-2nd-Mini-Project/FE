// src/components/GroupFormModal.jsx
import React from "react";
import '../../assets/modals/Modal.css'; // 공통 CSS 사용
import '../../assets/modals/GroupFormModal.css'; // 모임 생성 모달 전용 CSS

const GroupFormModal = ({ show, onClose, message }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="form-modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* 문구 영역 */}
        <div>
          <h2>
            모임 생성 완료
          </h2>
          <p>
            {message}
          </p>
        </div>

        {/* 확인 버튼 영역 */}
        <div>
          <button 
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupFormModal;