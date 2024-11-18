package com.example.smartplant.controller;

import com.example.smartplant.model.SensorData;
import com.example.smartplant.service.FirebaseMessagingService;
import com.example.smartplant.service.SensorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/sensors")  // API 엔드포인트
@CrossOrigin(origins = "*") // 모든 origin 허용 -> 프론트엔드와 연동할 때 발생할 수 있는 CORS 문제를 방지
public class SensorDataController {

    @Autowired
    private SensorDataService sensorDataService;

    @Autowired
    private FirebaseMessagingService firebaseMessagingService;

    // 모든 센서 데이터 조회
    @GetMapping
    public CompletableFuture<List<SensorData>> getSensorData() {
        return sensorDataService.getAllSensorData();
    }

    // 특정 시간 범위의 센서 데이터 조회
    @GetMapping("/range")  // API 엔드포인트
    public CompletableFuture<List<SensorData>> getSensorDataInRange(
            @RequestParam("start") long startTimestamp,
            @RequestParam("end") long endTimestamp
    ) {
        return sensorDataService.getSensorDataInRange(startTimestamp, endTimestamp);
    }

    // 센서 데이터 추가
    @PostMapping
    public CompletableFuture<Void> addSensorData(@RequestBody SensorData sensorData) {
        sensorData.setTimestamp(System.currentTimeMillis());
        CompletableFuture<Void> result = sensorDataService.saveSensorData(sensorData);

        // 토양 수분 부족 시 Firebase 메시지 전송
        if (sensorData.getSoilMoisture() < 30) {
            firebaseMessagingService.sendSoilMoistureAlert(sensorData);
        }

        return result;
    }

    // 센서 데이터 업데이트
    @PutMapping("/{id}")  // API 엔드포인트
    public CompletableFuture<Void> updateSensorData(@PathVariable String id, @RequestBody SensorData sensorData) {
        sensorData.setId(id);
        sensorData.setTimestamp(System.currentTimeMillis());
        return sensorDataService.updateSensorData(sensorData);
    }

    // 센서 데이터 삭제
    @DeleteMapping("/{id}")  // API 엔드포인트
    public CompletableFuture<Void> deleteSensorData(@PathVariable String id) {
        return sensorDataService.deleteSensorData(id);
    }

    // Bluetooth로 센서 데이터 수신
    @PostMapping("/bluetooth")  // API 엔드포인트
    public CompletableFuture<Void> receiveBluetoothData(@RequestBody String bluetoothData) { // Bluetooth 데이터 수신
        try {
            // 1. bluetoothData를 SensorData 객체로 변환 (파싱)
            SensorData sensorData = parseBluetoothData(bluetoothData);
            sensorData.setTimestamp(System.currentTimeMillis());

            // 2. Firebase Realtime Database에 저장
            return sensorDataService.saveSensorData(sensorData);
        } catch (Exception e) {
            // 예외 처리
            return CompletableFuture.failedFuture(e);
        }
    }

    private SensorData parseBluetoothData(String bluetoothData) {
        // TODO: Bluetooth 데이터 형식에 맞게 파싱 로직 구현
        // 예시: bluetoothData가 "temperature:25.5,humidity:60.2,soilMoisture:45.7" 형식이라고 가정
        String[] data = bluetoothData.split(",");
        double temperature = Double.parseDouble(data[0].split(":")[1]);
        double humidity = Double.parseDouble(data[1].split(":")[1]);
        double soilMoisture = Double.parseDouble(data[2].split(":")[1]);
        return new SensorData(null, temperature, humidity, soilMoisture, 0);
    }

    private boolean isValidSensorData(SensorData sensorData) {
        // 센서 데이터 유효성 검증 로직 구현
        // 예시: 온도, 습도, 토양 수분 값이 0 이상 100 이하인지 확인
        return sensorData.getTemperature() >= 0 && sensorData.getTemperature() <= 100 &&
                sensorData.getHumidity() >= 0 && sensorData.getHumidity() <= 100 &&
                sensorData.getSoilMoisture() >= 0 && sensorData.getSoilMoisture() <= 100;
    }

    // 데이터 분석 (일별, 주별, 월별)
    @GetMapping("/analysis")  // API 엔드포인트
    public ResponseEntity<Map<String, List<Double>>> getSensorDataAnalysis(
            @RequestParam("period") String period
    ) throws ExecutionException, InterruptedException {
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
        LocalDateTime start = now;
        switch (period) {
            case "daily": // 일별
                start = now.minusDays(1);
                break;
            case "weekly": // 주별
                start = now.minusWeeks(1);
                break;
            case "monthly": // 월별
                start = now.minusMonths(1);
                break;
            default:
                throw new IllegalArgumentException("Invalid period: " + period);
        }

        long startTimestamp = start.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
        long endTimestamp = now.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

        CompletableFuture<List<SensorData>> dataFuture = sensorDataService.getSensorDataInRange(startTimestamp, endTimestamp);
        List<SensorData> sensorDataList = dataFuture.get();

        // 데이터 분석 및 결과 생성
        Map<String, List<Double>> analysisResult = analyzeSensorData(sensorDataList, period, start, now);

        return ResponseEntity.ok(analysisResult);
    }

    private Map<String, List<Double>> analyzeSensorData(List<SensorData> sensorDataList, String period, LocalDateTime start, LocalDateTime end) {
        Map<String, List<Double>> result = new HashMap<>();
        List<Double> temperatureData = new ArrayList<>();
        List<Double> humidityData = new ArrayList<>();
        List<Double> soilMoistureData = new ArrayList<>();
        result.put("temperature", temperatureData);
        result.put("humidity", humidityData);
        result.put("soilMoisture", soilMoistureData);

        long timeUnitMillis;
        switch (period) {
            case "daily":
                timeUnitMillis = ChronoUnit.HOURS.getDuration().toMillis();
                break;
            case "weekly":
                timeUnitMillis = ChronoUnit.DAYS.getDuration().toMillis();
                break;
            case "monthly":
                timeUnitMillis = ChronoUnit.DAYS.getDuration().toMillis() * 7; // 주별 평균으로 계산
                break;
            default:
                throw new IllegalArgumentException("Invalid period: " + period);
        }

        LocalDateTime current = start;
        while (current.isBefore(end)) {
            LocalDateTime next = current.plus(timeUnitMillis, ChronoUnit.MILLIS);
            double temperatureSum = 0, humiditySum = 0, soilMoistureSum = 0;
            int count = 0;
            for (SensorData data : sensorDataList) {
                LocalDateTime dataTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(data.getTimestamp()), ZoneId.systemDefault());
                if (dataTime.isAfter(current) && dataTime.isBefore(next)) {
                    temperatureSum += data.getTemperature();
                    humiditySum += data.getHumidity();
                    soilMoistureSum += data.getSoilMoisture();
                    count++;
                }
            }
            if (count > 0) {
                temperatureData.add(temperatureSum / count);
                humidityData.add(humiditySum / count);
                soilMoistureData.add(soilMoistureSum / count);
            } else {
                temperatureData.add(0.0);
                humidityData.add(0.0);
                soilMoistureData.add(0.0);
            }
            current = next;
        }

        return result;
    }
}
