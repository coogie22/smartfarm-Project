const express = require('express');
const bodyParser = require('body-parser');
const firebaseAdmin = require('firebase-admin');
const path = require('path');

// Firebase Admin SDK 초기화
const serviceAccount = require(path.join(__dirname, '')); // JSON 키 파일 경로
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "",  // Firebase Database URL
});

const app = express();
const port = 5000;

// 미들웨어 설정
app.use(bodyParser.json());

// GET 요청 처리
app.get('/', (req, res) => {
  res.send('Node.js 서버가 정상적으로 실행 중입니다!');
});

// POST 요청 처리
app.post('/humidity', (req, res) => {
  const { soilHumidity, temperature, humidity } = req.body; // JSON 데이터에서 값을 추출
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] Received data:`);
  console.log(` - Soil Humidity: ${soilHumidity}%`);
  console.log(` - Temperature: ${temperature}°C`);
  console.log(` - Humidity: ${humidity}%`);

  // Firebase Realtime Database에 데이터 저장
  const db = firebaseAdmin.database();
  const dataRef = db.ref('sensorData'); // sensorData 경로에 데이터를 저장

  // 데이터 객체 생성
  const data = {
    soilHumidity: soilHumidity,
    temperature: temperature,
    humidity: humidity,
    timestamp: timestamp
  };

  // Firebase에 데이터 저장
  dataRef.push(data, (error) => {
    if (error) {
      console.error("데이터 저장 실패:", error);
      res.status(500).send("데이터 저장 실패");
    } else {
      console.log("데이터가 Firebase에 저장되었습니다.");
      res.status(200).send('Sensor data received and saved');
    }
  });
});

// 서버 시작
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
