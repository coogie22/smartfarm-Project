import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { getDatabase, ref, onChildAdded } from "firebase/database";
import { initializeApp } from "firebase/app";



// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function ChartComponent() {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  const MAX_VISIBLE_POINTS = 20;
  const updateFrameRef = useRef(null);
  const [latestData, setLatestData] = useState(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    // 로컬 스토리지에서 저장된 데이터 불러오기
    const savedChartData = JSON.parse(localStorage.getItem("chartData")) || {
      labels: [],
      data: [],
    };

    // Chart.js 초기화
    const chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: savedChartData.labels,
        datasets: [
          {
            label: "토양 습도 (%)",
            data: savedChartData.data,
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderWidth: 2,
            pointRadius: 4,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "nearest",
        },
        scales: {
          x: {
            title: { display: true, text: "시간" },
          },
          y: {
            beginAtZero: true,
            max: 100,
            title: { display: true, text: "습도 (%)" },
          },
        },
        plugins: {
          legend: { position: "top" },
        },
      },
    });

    chartRef.current = chartInstance;

    // Firebase 데이터 스트림 구독
    const humidityRef = ref(db, "humidityData");
    onChildAdded(humidityRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const { labels, datasets } = chartRef.current.data;

        const humidity = data.humidity;
        const timestamp = new Date(data.timestamp).toLocaleTimeString();

        // 최신 데이터 상태 업데이트
        setLatestData({
          humidity: humidity.toFixed(2),
          timestamp: new Date(data.timestamp).toLocaleString(),
        });

        // 중복된 시간대의 데이터는 추가하지 않도록 처리
        if (!labels.includes(timestamp)) {
          labels.push(timestamp);
          datasets[0].data.push(humidity);

          // 데이터 포인트 제한
          if (labels.length > MAX_VISIBLE_POINTS) {
            labels.shift();
            datasets[0].data.shift();
          }

          // requestAnimationFrame을 활용한 차트 업데이트
          if (!updateFrameRef.current) {
            updateFrameRef.current = requestAnimationFrame(() => {
              chartRef.current.update();
              updateFrameRef.current = null;
            });
          }
        }
      }
    });

    // 일정 주기로 로컬 스토리지 저장
    const storageInterval = setInterval(() => {
      const { labels, datasets } = chartRef.current.data;
      localStorage.setItem(
        "chartData",
        JSON.stringify({
          labels,
          data: datasets[0].data,
        })
      );
    }, 5000);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      if (updateFrameRef.current) {
        cancelAnimationFrame(updateFrameRef.current);
      }
      clearInterval(storageInterval);
    };
  }, []);

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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <h1
          style={{
            marginBottom: "20px",
            fontSize: "2.2rem",
            color: "#2e7d32",
            textAlign: "center",
          }}
        >
          실시간 데이터 차트
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "100%",
            maxWidth: "900px",
            alignItems: "center",
          }}
        >
          {/* 차트 */}
          <div
            style={{
              width: "100%",
              height: "400px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              overflow: "hidden",
              backgroundColor: "#fff",
            }}
          >
            <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }}></canvas>
          </div>

          {/* 실시간 데이터 */}
          <div
            style={{
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              backgroundColor: "#f9f9f9",
              width: "100%",
              maxWidth: "900px",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#00529b", marginBottom: "10px" }}>
              실시간 데이터
            </h3>
            {latestData ? (
              <>
                <p>
                  <strong>토양 습도:</strong> {latestData.humidity}%
                </p>
                <p>
                  <strong>수신 시간:</strong> {latestData.timestamp}
                </p>
              </>
            ) : (
              <p style={{ color: "#888" }}>데이터를 로드 중입니다...</p>
            )}
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer
        style={{
          backgroundColor: "#2e7d32",
          color: "#fff",
          textAlign: "center",
          padding: "15px",
          fontSize: "1rem",
          marginTop: "auto",
        }}
      >
        © 2024 스마트팜 모니터링 시스템. All rights reserved.
      </footer>
    </div>
  );
}

export default ChartComponent;
