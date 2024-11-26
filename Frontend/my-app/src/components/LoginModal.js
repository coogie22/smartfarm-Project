import React from "react";

function LoginModal({ onClose, onLogin }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          padding: "20px",
          width: "90%",
          maxWidth: "400px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* 닫기 버튼 */}
        <span
          style={{
            display: "inline-block",
            float: "right",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "#333",
          }}
          onClick={onClose}
        >
          &times;
        </span>

        {/* 제목 */}
        <h2
          style={{
            textAlign: "center",
            margin: "0 0 20px",
            color: "#4caf50",
            fontSize: "1.8rem",
          }}
        >
          로그인
        </h2>

        {/* 로그인 폼 */}
        <form
          onSubmit={(e) => {
            e.preventDefault(); // 폼 기본 동작 방지
            onLogin(); // 로그인 성공 처리
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <input
            type="text"
            placeholder="아이디"
            required
            style={{
              padding: "10px",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "1px solid #ddd",
              outline: "none",
            }}
          />
          <input
            type="password"
            placeholder="비밀번호"
            required
            style={{
              padding: "10px",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "1px solid #ddd",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px",
              fontSize: "1rem",
              color: "#fff",
              backgroundColor: "#4caf50",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#388e3c")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#4caf50")}
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
