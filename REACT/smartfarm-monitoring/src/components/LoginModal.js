import React from 'react';

function LoginModal({ onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>로그인</h2>
        <input type="text" placeholder="사용자명" required />
        <input type="password" placeholder="비밀번호" required />
        <button>로그인</button>
      </div>
    </div>
  );
}

export default LoginModal;
