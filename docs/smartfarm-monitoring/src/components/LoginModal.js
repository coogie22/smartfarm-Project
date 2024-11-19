import React from 'react';

function LoginModal({ onClose, onLogin }) {
  return (
    <div className="modal">
      <div className="modal-content">
        {/* X 버튼 */}
        <span className="close" onClick={onClose}>
          &times;
        </span>

        {/* 제목 */}
        <h2>로그인</h2>

        {/* 로그인 폼 */}
        <form
          onSubmit={(e) => {
            e.preventDefault(); // 폼 기본 동작 방지
            onLogin(); // 로그인 성공 처리
          }}
        >
          <input type="text" placeholder="아이디" required />
          <input type="password" placeholder="비밀번호" required />
          <button type="submit">로그인</button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
