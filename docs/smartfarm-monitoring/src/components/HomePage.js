import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>홈페이지</h2>
      <div>
        <Link to="/chart">
          <button style={{ margin: '10px', padding: '10px 20px', fontSize: '18px' }}>차트 페이지</button>
        </Link>
        <Link to="/analysis">
          <button style={{ margin: '10px', padding: '10px 20px', fontSize: '18px' }}>데이터 분석 페이지</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
