import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* 컨텐츠 영역 */}
      <main
        style={{
          flex: "1",
          textAlign: "center",
          marginTop: "50px",
          padding: "20px",
        }}
      >
        <h1 style={{ fontSize: "2.8rem", color: "#4caf50", marginBottom: "20px" }}>
          스마트팜 모니터링 시스템
        </h1>
        <p style={{ fontSize: "1.3rem", color: "#555", marginBottom: "40px" }}>
          실시간 데이터 모니터링과 분석을 통해 스마트한 농업 관리 시스템을 경험하세요!
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px", // 버튼 간격 조정
            flexWrap: "wrap",
          }}
        >
          {/* 차트 페이지 링크 */}
          <Link to="/chart" style={{ textDecoration: "none" }}>
            <div
              style={{
                backgroundColor: "#f4f4f4",
                padding: "40px", // 패딩 증가
                borderRadius: "15px",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                width: "300px", // 크기 통일
                height: "180px", // 고정 높이
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.transform = "translateY(-10px)")
              }
              onMouseLeave={(e) =>
                (e.target.style.transform = "translateY(0)")
              }
            >
              <h3 style={{ marginBottom: "15px", color: "#4caf50", fontSize: "1.7rem" }}>
                차트 페이지
              </h3>
              <p style={{ color: "#777", fontSize: "1.2rem" }}>
                실시간 환경 데이터를 확인하세요.
              </p>
            </div>
          </Link>
          {/* 데이터 분석 링크 */}
          <Link to="/analysis" style={{ textDecoration: "none" }}>
            <div
              style={{
                backgroundColor: "#f4f4f4",
                padding: "40px", // 패딩 증가
                borderRadius: "15px",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                width: "300px", // 크기 통일
                height: "180px", // 고정 높이
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.transform = "translateY(-10px)")
              }
              onMouseLeave={(e) =>
                (e.target.style.transform = "translateY(0)")
              }
            >
              <h3 style={{ marginBottom: "15px", color: "#4caf50", fontSize: "1.7rem" }}>
                데이터 분석
              </h3>
              <p style={{ color: "#777", fontSize: "1.2rem" }}>
                데이터를 확인하세요.
              </p>
            </div>
          </Link>
        </div>
      </main>

      {/* 푸터 */}
      <footer
        style={{
          backgroundColor: "#4caf50",
          color: "#fff",
          textAlign: "center",
          padding: "15px",
          fontSize: "1rem",
        }}
      >
        © 2024 스마트팜 모니터링 시스템. All rights reserved.
      </footer>
    </div>
  );
}

export default HomePage;
