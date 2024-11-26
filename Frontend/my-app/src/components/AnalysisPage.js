import React, { useEffect, useState, useCallback } from "react";
import { getDatabase, ref, onValue, query, orderByChild, startAt, endAt } from "firebase/database";
import { initializeApp } from "firebase/app";



// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function AnalysisPage() {
  const [tableData, setTableData] = useState([]); // 테이블 데이터
  const [activeTab, setActiveTab] = useState('hour'); // 활성화된 탭 상태 (hour, day, week)
  const [loading, setLoading] = useState(false); // 로딩 상태

  // 시간 필터링을 위한 현재 시간 계산
  const getTimeRange = (tab) => {
    const now = new Date();
    switch (tab) {
      case 'hour': // 지난 1시간
        return { start: now.getTime() - 60 * 60 * 1000, end: now.getTime() };
      case 'day': // 오늘
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        return { start: startOfDay.getTime(), end: Date.now() };
      case 'week': // 지난 1주일
        return { start: now.getTime() - 7 * 24 * 60 * 60 * 1000, end: now.getTime() };
      default:
        return { start: 0, end: Date.now() };
    }
  };

  // 데이터 로드 함수
  const loadData = useCallback((tab) => {
    setLoading(true);
    const { start, end } = getTimeRange(tab);

    const dataRef = ref(db, "humidityData");

    // Firebase 데이터 구독 (시간 범위에 맞는 데이터만 조회)
    const dataQuery = query(
      dataRef,
      orderByChild("timestamp"),
      startAt(new Date(start).toISOString()), // 시간 범위 시작
      endAt(new Date(end).toISOString()) // 시간 범위 종료
    );

    onValue(dataQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.values(data).map((item) => ({
          timestamp: new Date(item.timestamp).toLocaleString(),
          temperature: item.temperature,  // 온도
          humidity: item.humidity,        // 습도
          soilMoisture: item.soilMoisture,  // 토양 수분
        }));

        setTableData(formattedData.reverse()); // 데이터가 최신순으로 정렬되도록 처리
      } else {
        setTableData([]); // 데이터가 없을 경우
      }
      setLoading(false);
    });
  }, []);

  // 탭 클릭 시 데이터 로드
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    loadData(tab);
  };

  useEffect(() => {
    loadData(activeTab); // 초기 로딩 시 활성화된 탭에 맞는 데이터 로드
  }, [activeTab, loadData]);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>데이터 분석</h2>

      {/* 탭 UI */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <button
          onClick={() => handleTabClick('hour')}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === 'hour' ? "#007bff" : "#f1f1f1",
            border: "none",
            cursor: "pointer",
            margin: "0 10px",
            color: activeTab === 'hour' ? "#fff" : "#007bff",
            borderRadius: "5px"
          }}
        >
          지난 1시간
        </button>
        <button
          onClick={() => handleTabClick('day')}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === 'day' ? "#007bff" : "#f1f1f1",
            border: "none",
            cursor: "pointer",
            margin: "0 10px",
            color: activeTab === 'day' ? "#fff" : "#007bff",
            borderRadius: "5px"
          }}
        >
          오늘
        </button>
        <button
          onClick={() => handleTabClick('week')}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === 'week' ? "#007bff" : "#f1f1f1",
            border: "none",
            cursor: "pointer",
            margin: "0 10px",
            color: activeTab === 'week' ? "#fff" : "#007bff",
            borderRadius: "5px"
          }}
        >
          지난 1주일
        </button>
      </div>

      <div
        style={{
          marginTop: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          backgroundColor: "#f9f9f9",
          padding: "20px",
        }}
      >
        <h3 style={{ textAlign: "center" }}>저장된 데이터</h3>
        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            border: "1px solid #ddd",
            padding: "10px",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f4f4f4" }}>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>시간</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>온도 (°C)</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>습도 (%)</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>토양 수분 (%)</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 ? (
                tableData.map((row, index) => (
                  <tr key={index}>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {row.timestamp}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {row.temperature}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {row.humidity}%  {/* 습도에 정확히 습도 표시 */}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {row.soilMoisture}%  {/* 토양 수분에 정확히 토양 수분 표시 */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      border: "1px solid #ddd",
                    }}
                  >
                    데이터를 불러오는 중입니다...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {loading && <p style={{ textAlign: "center" }}>데이터를 로딩 중입니다...</p>}
      </div>
    </div>
  );
}

export default AnalysisPage;
