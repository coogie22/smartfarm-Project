import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import AnalysisPage from './components/AnalysisPage';
import ChartComponent from './components/ChartComponent';
import Controls from './components/Controls';
import LoginModal from './components/LoginModal'; // LoginModal 추가

function App() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  return (
    <Router>
      <div className="App">
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
        <main>
          {showModal && <LoginModal onClose={() => setShowModal(false)} />}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chart" element={<><ChartComponent /><Controls /></>} />
            <Route path="/analysis" element={<AnalysisPage />} />
          </Routes>
        </main>
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
