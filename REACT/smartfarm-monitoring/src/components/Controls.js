import React from 'react';

function Controls() {
  const setTemperature = () => {
    const tempValue = prompt("설정할 온도를 입력하세요:");
    if (tempValue) {
      alert(`설정된 온도: ${tempValue}`);
    }
  };

  const setHumidity = () => {
    const humidityValue = prompt("설정할 습도를 입력하세요:");
    if (humidityValue) {
      alert(`설정된 습도: ${humidityValue}`);
    }
  };

  const setSoilMoisture = () => {
    const moistureValue = prompt("설정할 토양 수분을 입력하세요:");
    if (moistureValue) {
      alert(`설정된 토양 수분: ${moistureValue}`);
    }
  };

  return (
    <div className="controls">
      <input type="number" id="timeInput" placeholder="시간 입력" />
      <select id="timeUnit">
        <option value="seconds">초</option>
        <option value="minutes">분</option>
        <option value="hours">시간</option>
      </select>
      <button>시간 단위 설정</button>
      <button onClick={setTemperature}>온도 조절</button>
      <button onClick={setHumidity}>습도 조절</button>
      <button onClick={setSoilMoisture}>토양 수분 조절</button>
    </div>
  );
}

export default Controls;
