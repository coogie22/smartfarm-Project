import React, { useState } from 'react';

function AnalysisPage() {
  const [selectedTab, setSelectedTab] = useState('day'); // 탭 상태 관리
  const [data, setData] = useState([
    { id: 1, date: '2024-11-19', temperature: 25, humidity: 60, soilMoisture: 30 },
    { id: 2, date: '2024-11-18', temperature: 22, humidity: 65, soilMoisture: 35 },
    { id: 3, date: '2024-11-17', temperature: 24, humidity: 55, soilMoisture: 40 },
  ]); // 샘플 데이터

  // 저장된 데이터 추가
  const handleAddData = () => {
    const date = prompt('데이터를 저장할 날짜 (YYYY-MM-DD):');
    const temperature = parseFloat(prompt('온도 값을 입력하세요:'));
    const humidity = parseFloat(prompt('습도 값을 입력하세요:'));
    const soilMoisture = parseFloat(prompt('토양 수분 값을 입력하세요:'));

    if (date && temperature && humidity && soilMoisture) {
      const newData = {
        id: data.length + 1,
        date,
        temperature,
        humidity,
        soilMoisture,
      };
      setData([...data, newData]);
    } else {
      alert('모든 값을 정확히 입력해주세요.');
    }
  };

  // 탭에 따라 필터링된 데이터 표시
  const filteredData =
    selectedTab === 'day'
      ? data.slice(0, 1) // 가장 최근 데이터
      : selectedTab === 'week'
      ? data.slice(0, 7) // 최근 7일 데이터
      : data; // 전체 데이터 (월 단위)

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <h2>데이터 분석 페이지</h2>
      <div style={{ marginBottom: '20px' }}>
        <button
          style={{
            margin: '5px',
            padding: '10px 20px',
            backgroundColor: selectedTab === 'day' ? '#4caf50' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={() => setSelectedTab('day')}
        >
          일 단위
        </button>
        <button
          style={{
            margin: '5px',
            padding: '10px 20px',
            backgroundColor: selectedTab === 'week' ? '#4caf50' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={() => setSelectedTab('week')}
        >
          주 단위
        </button>
        <button
          style={{
            margin: '5px',
            padding: '10px 20px',
            backgroundColor: selectedTab === 'month' ? '#4caf50' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={() => setSelectedTab('month')}
        >
          월 단위
        </button>
      </div>

      <div>
        <h3>저장된 데이터</h3>
        <button
          style={{
            margin: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={handleAddData}
        >
          데이터 추가
        </button>
        <table style={{ margin: '20px auto', width: '80%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>날짜</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>온도 (°C)</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>습도 (%)</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>토양 수분 (%)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((entry) => (
              <tr key={entry.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.date}</td>
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
