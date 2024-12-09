import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { getDatabase, ref, onChildAdded } from "firebase/database";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function ChartComponent() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [latestData, setLatestData] = useState({
    soilHumidity: null,
    airHumidity: null,
    temperature: null,
    timestamp: null,
  });
  const [showModal, setShowModal] = useState(false); // 모달 상태 관리
  const MAX_VISIBLE_POINTS = 20;

  useEffect(() => {
    if (!canvasRef.current) {
      console.error("Canvas element is missing.");
      return;
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) {
      console.error("Failed to get 2D context.");
      return;
    }

    if (chartRef.current) {
      console.warn("Chart instance already exists. Destroying old chart.");
      chartRef.current.destroy();
    }

    // 차트 초기화
    chartRef.current = new Chart(ctx, {
      type: "line", // 원하는 차트 유형 (막대형이라면 "bar"로 변경)
      data: {
        labels: [],
        datasets: [
          {
            label: "토양 습도 (%)",
            data: [],
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
            tension: 0.4,
          },
          {
            label: "공기 습도 (%)",
            data: [],
            backgroundColor: "rgba(255, 159, 64, 0.6)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 2,
            tension: 0.4,
          },
          {
            label: "온도 (°C)",
            data: [],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: "시간" },
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: "값" },
          },
        },
        plugins: {
          legend: { position: "top" },
        },
      },
    });

    // Firebase 데이터 구독
    const sensorDataRef = ref(db, "sensorData");
    onChildAdded(sensorDataRef, (snapshot) => {
      const data = snapshot.val();
      console.log("받은 데이터:", data);

      if (data) {
        const soilHumidity = data.soilHumidity || 0;
        const airHumidity = data.humidity || 0;
        const temperature = data.temperature || 0;
        const timestamp = new Date(data.timestamp).toLocaleTimeString();

        // 최신 데이터 업데이트
        setLatestData({
          soilHumidity: soilHumidity.toFixed(2),
          airHumidity: airHumidity.toFixed(2),
          temperature: temperature.toFixed(2),
          timestamp: new Date(data.timestamp).toLocaleString(),
        });

        const chart = chartRef.current;
        if (!chart.data.labels.includes(timestamp)) {
          chart.data.labels.push(timestamp);
          chart.data.datasets[0].data.push(soilHumidity);
          chart.data.datasets[1].data.push(airHumidity);
          chart.data.datasets[2].data.push(temperature);

          // MAX_VISIBLE_POINTS 이상이면 데이터 자르기
          if (chart.data.labels.length > MAX_VISIBLE_POINTS) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
            chart.data.datasets[1].data.shift();
            chart.data.datasets[2].data.shift();
          }

          chart.update();
        }

        // 토양 습도가 30% 미만일 경우 알림 모달 띄우기
        if (soilHumidity < 30) {
          setShowModal(true);
        }
      }
    });

    // 컴포넌트 unmount 시 정리
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  // 모달 닫기
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
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
        <h1 style={{ marginBottom: "20px", fontSize: "2.2rem", color: "#2e7d32", textAlign: "center" }}>
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
            <h3 style={{ color: "#00529b", marginBottom: "10px" }}>실시간 데이터</h3>
            {latestData.timestamp ? (
              <>
                <p>
                  <strong>토양 습도:</strong> {latestData.soilHumidity}%
                </p>
                <p>
                  <strong>공기 습도:</strong> {latestData.airHumidity}%
                </p>
                <p>
                  <strong>온도:</strong> {latestData.temperature}°C
                </p>
                <p>
                  <strong>시간:</strong> {latestData.timestamp}
                </p>
              </>
            ) : (
              <p>데이터 로딩 중...</p>
            )}
          </div>
        </div>
      </main>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <h2>알림</h2>
            <p>토양 습도가 30% 미만입니다. 확인해주세요!</p>
            <button
              onClick={closeModal}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f44336",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChartComponent;
