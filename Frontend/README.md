# backend1

아두이노 ide 설치 

https://www.silabs.com/developer-tools/usb-to-uart-bridge-vcp-drivers?tab=downloads 에서 CP210 VCP Drivers 다운로드 후 압축 해제 후

CP210xVCPinstaller_64 설치

아두이노 실행 후 기본설정 - 추가 보드 관리자 url에 https://dl.espressif.com/dl/package_esp32_index.json 입력 후 저장

도구 - 보드 - 보드 매니저를 실행 후 ESP32 by Espressif System 설치

재시작 하고 아두이노 usb 연결 

그리고 usb 포트 클릭 후 보드 및 포트를 선택하세요 - ESP32 Dev Module - COM5 설치

이제 간단한 예제 코드 넣고 테스트 

void setup() {
  Serial.begin(9600); // 시리얼 통신 초기화 / 전송속도 설정
}

void loop() {
  Serial.println("테스트");
}

넣고 업로드 문제가 없다면 테스트가 시리얼 모니터에 계속 출력

DHT 라이브러리 설치
아두이노 IDE 열기

아두이노 IDE를 실행합니다.
라이브러리 매니저 열기

상단 메뉴에서 Sketch > Include Library > **Manage Libraries...**를 클릭합니다.
DHT 검색

검색창에 DHT를 입력합니다.
"DHT sensor library by Adafruit"를 찾습니다.
설치

"DHT sensor library by Adafruit" 옆에 있는 Install 버튼을 클릭하여 설치합니다.
필요한 경우, 관련 의존성(Adafruit Unified Sensor Library)도 함께 설치하세요.

정확한 라이브러리 이름
아두이노 IDE에서 설치해야 하는 라이브러리는 다음과 같습니다:

DHT sensor library by Adafruit


The library DHT sensor library:1.4.6 needs another dependency currently not installed:
- Adafruit Unified Sensor
Would you like to install the missing dependency?
INSTALL WITHOUT DEPENDENCIES
모두 설치



현재 포트를 사용 중인 프로세스 찾기
먼저 5000번 포트를 사용 중인 프로세스를 찾아야 합니다. 아래 명령어를 사용하여 이를 확인할 수 있습니다.

bash
코드 복사
lsof -i :5000
또는 netstat를 사용할 수도 있습니다:

bash
코드 복사
netstat -tuln | grep :5000
위 명령어를 실행하면, 5000번 포트를 사용 중인 프로세스의 PID를 확인할 수 있습니다.

2. 프로세스 종료하기
포트를 사용 중인 프로세스를 확인한 후, 해당 프로세스를 종료할 수 있습니다. kill 명령어를 사용하여 프로세스를 종료합니다. PID는 위 명령어로 확인한 프로세스의 ID입니다.

bash
코드 복사
kill -9 <PID>


leejaewon6463@instance-20241120-212215:~$ lsof -i :5000
COMMAND  PID          USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    1761 leejaewon6463   19u  IPv4  23854      0t0  TCP *:5000 (LISTEN)
leejaewon6463@instance-20241120-212215:~$ kill -9 1761



3.3V = VCC , + 

GND = 


토양 습도 센서 = VCC , GND , D34

온습도 센서 = +(VCC) , out(D13) , -(GND)
 
물펌프 센서(릴레이 모듈) = -(GND)  , +(3.3V) , S(D4)