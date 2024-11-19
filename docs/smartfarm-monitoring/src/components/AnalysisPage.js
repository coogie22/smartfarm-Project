import React, { useEffect, useState } from 'react';

function AnalysisPage() {
  const [data, setData] = useState([]); // 실시간 데이터 저장
  const MAX_ENTRIES = 100; // 최대 저장 데이터 수 제한

  // WebSocket 연결 및 데이터 처리
  useEffect(() => {
    const socket = new WebSocket('ws://34.22.71.108:5000'); // Node.js WebSocket 서버 주소

    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);

      setData((prevData) => {
        const updatedData = [
          {
            id: prevData.length + 1,
            datetime: new Date(newData.timestamp).toLocaleString(), // 날짜와 시간
            temperature: newData.temperature,
            humidity: newData.humidity,
            soilMoisture: newData.soilMoisture,
          },
          ...prevData,
        ];

        // 최대 데이터 수를 초과하면 오래된 데이터 제거
        return updatedData.slice(0, MAX_ENTRIES);
      });
    };

    return () => {
      socket.close(); // 컴포넌트 언마운트 시 WebSocket 종료
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <h2>실시간 데이터 저장 및 표시</h2>

      <div>
        <h3>저장된 데이터</h3>
        <table style={{ margin: '20px auto', width: '80%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>날짜와 시간</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>온도 (°C)</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>습도 (%)</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>토양 수분 (%)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr key={entry.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.datetime}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.temperature}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.humidity}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.soilMoisture}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AnalysisPage;
