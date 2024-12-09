#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h> // 온습도 센서를 위한 라이브러리

// Wi-Fi 정보
const char* ssid = "";       // Wi-Fi 이름
const char* password = "";     // Wi-Fi 비밀번호

const char* serverName = ""; // Node.js 서버 주소

// 센서 핀 설정
const int soilSensorPin = 34;  // 토양 습도 센서 핀
const int dhtPin = 13;         // 온습도 센서 핀
const int relayPin = 4;        // 릴레이 제어 핀

// DHT 센서 설정
#define DHTTYPE DHT22         // DHT 센서 타입 (DHT11 또는 DHT22 선택)
DHT dht(dhtPin, DHTTYPE);

bool isServerRunning = true;  // 서버 상태 제어 변수

void setup() {
  Serial.begin(9600); // 시리얼 모니터 초기화
  dht.begin();        // DHT 센서 초기화

  // 릴레이 핀 설정
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, LOW); // 릴레이 초기 상태를 꺼짐으로 설정

  // Wi-Fi 연결
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi 연결 완료!");
  Serial.print("IP 주소: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // 시리얼 모니터에서 "stop" 또는 "start" 명령을 받아 서버 제어
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    input.trim();
    if (input == "stop") {
      isServerRunning = false;
      Serial.println("서버 중단.");
    } else if (input == "start") {
      isServerRunning = true;
      Serial.println("서버 시작.");
    }
  }

  if (isServerRunning) {
    if (WiFi.status() == WL_CONNECTED) {
      // 토양 습도 센서 값 읽기
      int soilValue = analogRead(soilSensorPin);
      float soilHumidity = map(soilValue, 0, 4095, 100, 0); // 값 매핑

      // 온습도 센서 값 읽기
      float temperature = dht.readTemperature(); // 온도
      float humidity = dht.readHumidity();       // 습도

      // 릴레이 제어 조건: 토양 습도가 30% 이하일 때 물 펌프 작동
      if (soilHumidity <= 30) {
        digitalWrite(relayPin, HIGH); // 릴레이 켜기
        Serial.println("물 펌프 작동 중...");
        delay(3000);                  // 3초 동안 켜짐
        digitalWrite(relayPin, LOW);  // 릴레이 끄기
        Serial.println("물 펌프 꺼짐.");
      }

      // 디버깅용 시리얼 출력 (한글)
      Serial.print("토양 센서 값: ");
      Serial.println(soilValue);
      Serial.print("토양 습도: ");
      Serial.print(soilHumidity);
      Serial.println(" %");
      Serial.print("온도: ");
      Serial.print(temperature);
      Serial.println(" °C");
      Serial.print("습도: ");
      Serial.print(humidity);
      Serial.println(" %");

      // JSON 데이터 생성
      String jsonData = "{\"soilHumidity\":" + String(soilHumidity) +
                        ",\"temperature\":" + String(temperature) +
                        ",\"humidity\":" + String(humidity) + "}";

      // HTTP 요청 전송
      HTTPClient http;
      http.begin(serverName);
      http.addHeader("Content-Type", "application/json");

      int httpResponseCode = http.POST(jsonData);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.print("HTTP 응답 코드: ");
        Serial.println(httpResponseCode);
        Serial.println("서버 응답: " + response);
      } else {
        Serial.print("POST 요청 실패: ");
        Serial.println(httpResponseCode);
        Serial.print("오류 메시지: ");
        Serial.println(http.errorToString(httpResponseCode).c_str());
      }

      http.end();
    } else {
      Serial.println("Wi-Fi 연결 끊김.");
    }

    delay(3000); // 3초마다 데이터 전송
  } else {
    delay(1000); // 서버 중단 상태에서는 1초 대기
  }
}
