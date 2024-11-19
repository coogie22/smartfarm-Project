import React, { useEffect, useState } from 'react';

function BackendData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // 백엔드 API 호출
    fetch('http://34.22.71.108:5000/api/data') // Node.js 서버 주소
      .then((response) => response.json()) // 응답을 JSON으로 파싱
      .then((data) => setData(data)) // 상태에 데이터 저장
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>React와 Node.js 통신</h1>
      {data ? (
        <div>
          <p>메시지: {data.message}</p>
          <p>시간: {new Date(data.timestamp).toLocaleString()}</p>
        </div>
      ) : (
        <p>로딩 중...</p>
      )}
    </div>
  );
}

export default BackendData;
