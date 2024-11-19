# 융합소프트웨어프로젝트- smartfarm-Project 

# Firebase 기반 실시간 센서 데이터 수집 및 사용자 알림 기능을 갖춘 Spring Boot 서버
# 주요 기능들 정리 =>

1. 토양 수분이 부족하면 Firebase Cloud Messaging을 통해 사용자에게 알림 전송 ✅

2. 사용자 등록 및 로그인 기능을 제공합니다.  Firebase Authentication 연동 및 
REST API를 통한 회원가입/로그인 기능  ✅

3. REST API를 통해 식물의 센서 데이터(온도, 습도, 토양 수분) 를 Firebase Realtime Database에 저장하고
CRUD 작업을 처리 ✅

4. Bluetooth를 통해 센서 데이터를 수신하고  Firebase Realtime Database에 저장. ✅
=> receiveBluetoothData 메서드에서 Bluetooth 데이터 수신 및 파싱, 저장 로직이 구현

5. 특정 기간 동안의 센서 데이터 분석 기능 제공 (일별, 주별, 월별) ✅

6. API 문서화: Swagger(OpenAPI)를 이용한 RESTful API 자동 문서화 기능 제공 ✅



추가 고려사항 =>
보안 강화: Firebase Authentication API 키를 환경 변수로 관리하여 보안을 강화하는 것이 좋습니다.
