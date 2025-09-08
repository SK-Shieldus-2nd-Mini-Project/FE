// src/components/Modal.jsx
import React from 'react';
import '../assets/Modal.css';

const Modal = ({ show, onClose, title, message, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h4 className="modal-title">{title}</h4>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        <div className="modal-body">
          {message && <p>{message}</p>}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;