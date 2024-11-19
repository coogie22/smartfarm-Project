import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function ChartComponent() {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  const MAX_VISIBLE_POINTS = 20;

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
          duration: 500, // 애니메이션 지속 시간 (밀리초)
          easing: 'linear', // 선형 이동
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    chartRef.current = chartInstance;

    // 실시간 데이터 업데이트
    const interval = setInterval(() => {
      if (chartRef.current) {
        const now = new Date().toLocaleTimeString();
        const { labels, datasets } = chartRef.current.data;

        // 새로운 데이터 추가
        labels.push(now);
        datasets[0].data.push(Math.random() * 30 + 20); // 온도 랜덤값
        datasets[1].data.push(Math.random() * 50 + 30); // 습도 랜덤값
        datasets[2].data.push(Math.random() * 100); // 토양 수분 랜덤값

        // 오래된 데이터는 자연스럽게 사라지도록 설정
        if (labels.length > MAX_VISIBLE_POINTS) {
          labels.shift(); // 가장 오래된 시간 제거
          datasets.forEach((dataset) => dataset.data.shift()); // 가장 오래된 데이터 제거
        }

        chartRef.current.update(); // 차트 업데이트
      }
    }, 1000); // 1초마다 업데이트

    return () => {
      clearInterval(interval);
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="chart-container">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default ChartComponent;
