import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

function ChartComponent() {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  const MAX_VISIBLE_POINTS = 20;
  const [latestData, setLatestData] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: '온도',
            data: [],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 1,
          },
          {
            label: '습도',
            data: [],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 1,
          },
          {
            label: '토양 수분',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 500,
          easing: 'linear',
        },
        scales: {
          x: { beginAtZero: true },
          y: { beginAtZero: true },
        },
      },
    });

    chartRef.current = chartInstance;

    // WebSocket 연결
    const socket = new WebSocket('ws://34.22.71.108:5000'); // Google VM의 외부 IP 사용
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { labels, datasets } = chartRef.current.data;

      // 최신 데이터 저장
      setLatestData({
        temperature: data.temperature,
        humidity: data.humidity,
        soilMoisture: data.soilMoisture,
        timestamp: data.timestamp,
      });

      // 데이터 히스토리에 추가
      setHistoryData((prevHistory) => [
        {
          temperature: data.temperature,
          humidity: data.humidity,
          soilMoisture: data.soilMoisture,
          timestamp: data.timestamp,
        },
        ...prevHistory,
      ]);

      // 차트 업데이트
      labels.push(new Date(data.timestamp).toLocaleTimeString());
      datasets[0].data.push(data.temperature); // 온도
      datasets[1].data.push(data.humidity); // 습도
      datasets[2].data.push(data.soilMoisture); // 토양 수분

      if (labels.length > MAX_VISIBLE_POINTS) {
        labels.shift();
        datasets.forEach((dataset) => dataset.data.shift());
      }

      chartRef.current.update();
    };

    socket.onerror = (error) => {
      console.error('WebSocket 오류:', error);
    };

    return () => {
      socket.close();
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <div className="chart-container" style={{ flex: 1 }}>
        <canvas ref={canvasRef}></canvas>
      </div>

      <div
        style={{
          flexBasis: '300px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#f9f9f9',
        }}
      >
        <h3 style={{ textAlign: 'center', color: '#00529b', marginBottom: '20px' }}>
          Node.js에서 받아온 임의 데이터
        </h3>
        {latestData ? (
          <>
            <div style={{ marginBottom: '20px' }}>
              <p><strong>온도:</strong> {latestData.temperature}°C</p>
              <p><strong>습도:</strong> {latestData.humidity}%</p>
              <p><strong>토양 수분:</strong> {latestData.soilMoisture}%</p>
              <p><strong>수신 시간:</strong> {new Date(latestData.timestamp).toLocaleString()}</p>
            </div>

            <div
              style={{
                maxHeight: '200px',
                overflowY: 'auto',
                border: '1px solid #ddd',
                padding: '10px',
                borderRadius: '5px',
                backgroundColor: '#fff',
              }}
            >
              {historyData.map((item, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <p>
                    <strong>온도:</strong> {item.temperature}°C,{' '}
                    <strong>습도:</strong> {item.humidity}%,{' '}
                    <strong>토양 수분:</strong> {item.soilMoisture}%<br />
                    <strong>수신 시간:</strong> {new Date(item.timestamp).toLocaleString()}
                  </p>
                  <hr style={{ margin: '5px 0', borderTop: '1px solid #ddd' }} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <p style={{ color: '#888', textAlign: 'center' }}>데이터를 로드 중...</p>
        )}
      </div>
    </div>
  );
}

export default ChartComponent;
