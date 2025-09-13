import React from 'react';
import '../../assets/modals/Modal.css'; // 공용 오버레이
import '../../assets/modals/ConfirmModal.css'; // 확인 모달 전용 스타일

const GroupConfirmModal = ({ show, onClose, message }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>✅</h2>
        <h3>모임 생성 완료</h3>
        <p>{message}</p>
        <button onClick={onClose}>확인</button>
      </div>
    </div>
  );
};

export default GroupConfirmModal;