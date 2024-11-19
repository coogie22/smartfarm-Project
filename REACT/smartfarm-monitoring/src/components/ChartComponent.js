import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function ChartComponent() {
  const chartRef = useRef(null); // Chart.js 인스턴스를 저장
  const canvasRef = useRef(null); // 캔버스 DOM 참조

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [], // 시간 라벨
        datasets: [
          {
            label: '온도',
            data: [], // 온도 데이터
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 1,
          },
          {
            label: '습도',
            data: [], // 습도 데이터
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 1,
          },
          {
            label: '토양 수분',
            data: [], // 토양 수분 데이터
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
        const now = new Date().toLocaleTimeString(); // 현재 시간
        chartRef.current.data.labels.push(now); // 시간 라벨 추가
        if (chartRef.current.data.labels.length > 10) {
          chartRef.current.data.labels.shift(); // 오래된 라벨 제거
        }

        // 랜덤 데이터 추가
        chartRef.current.data.datasets[0].data.push(Math.random() * 30 + 20); // 온도 랜덤값
        chartRef.current.data.datasets[1].data.push(Math.random() * 50 + 30); // 습도 랜덤값
        chartRef.current.data.datasets[2].data.push(Math.random() * 100); // 토양 수분 랜덤값

        // 오래된 데이터 제거
        chartRef.current.data.datasets.forEach((dataset) => {
          if (dataset.data.length > 10) {
            dataset.data.shift();
          }
        });

        chartRef.current.update(); // 차트 업데이트
      }
    }, 1000); // 1초마다 업데이트

    return () => {
      clearInterval(interval); // 컴포넌트 언마운트 시 타이머 제거
      if (chartRef.current) {
        chartRef.current.destroy(); // 기존 Chart.js 인스턴스 제거
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
