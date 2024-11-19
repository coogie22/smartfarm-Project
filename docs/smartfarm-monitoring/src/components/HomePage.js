import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#4caf50', marginBottom: '20px' }}>
        스마트팜 모니터링 시스템
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '40px' }}>
        실시간 데이터 모니터링과 분석을 통해 스마트한 농업 관리 시스템을 경험하세요!
      </p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <Link to="/chart" style={{ textDecoration: 'none' }}>
          <div
            style={{
              backgroundColor: '#f4f4f4',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              width: '200px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={(e) =>
              (e.target.style.transform = 'translateY(-5px)')
            }
            onMouseLeave={(e) =>
              (e.target.style.transform = 'translateY(0)')
            }
          >
            <h3 style={{ marginBottom: '10px', color: '#4caf50' }}>
              차트 페이지
            </h3>
            <p style={{ color: '#777' }}>실시간 환경 데이터를 확인하세요.</p>
          </div>
        </Link>
        <Link to="/analysis" style={{ textDecoration: 'none' }}>
          <div
            style={{
              backgroundColor: '#f4f4f4',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              width: '200px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={(e) =>
              (e.target.style.transform = 'translateY(-5px)')
            }
            onMouseLeave={(e) =>
              (e.target.style.transform = 'translateY(0)')
            }
          >
            <h3 style={{ marginBottom: '10px', color: '#4caf50' }}>
              데이터 분석
            </h3>
            <p style={{ color: '#777' }}>데이터를 분석하고 인사이트를 얻으세요.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
