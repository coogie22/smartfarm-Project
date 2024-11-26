import React, { useState, useEffect } from 'react';
import './App.css';
import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'; // HashRouter로 변경
import HomePage from './components/HomePage';
import AnalysisPage from './components/AnalysisPage';
import ChartComponent from './components/ChartComponent';
import LoginModal from './components/LoginModal';

function App() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [isModalOpen, setIsModalOpen] = useState(true); // 모달 상태 관리

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  const handleLogin = () => {
    setIsModalOpen(false); // 로그인 성공 시 모달 닫기
  };

  return (
    <Router> {/* HashRouter로 변경 */}
      <div className="App">
        {/* 헤더 */}
        <header>
          <div className="dropdown">
            <button>메뉴</button>
            <div className="dropdown-content">
              <Link to="/">홈</Link>
              <Link to="/chart">모니터링</Link>
              <Link to="/analysis">데이터 분석</Link>
            </div>
          </div>
          <h1 className="header-title">스마트팜 모니터링</h1>
          <div id="clock">{time}</div>
        </header>

        {/* 메인 */}
        <main>
          {isModalOpen && (
            <LoginModal
              onClose={() => setIsModalOpen(false)} // 닫기 버튼 동작
              onLogin={handleLogin} // 로그인 동작
            />
          )}
          <Routes>
            {/* 기본 경로 */}
            <Route path="/" element={<HomePage />} />

            {/* 차트 페이지 */}
            <Route path="/chart" element={<ChartComponent />} /> {/* Controls 삭제 */}

            {/* 데이터 분석 페이지 */}
            <Route path="/analysis" element={<AnalysisPage />} />

            {/* 잘못된 경로 -> 홈페이지로 리다이렉트 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* 푸터 */}
        <footer>
          <p>
            © 2024 스마트팜 모니터링 -{' '}
            <a
              href="https://github.com/coogie22/smartfarm-Project"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
            >
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
