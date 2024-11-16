package com.example.smartplant.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig { // Firebase를 Spring Boot 애플리케이션에서 사용할 수 있도록 설정하는 파일

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        // FileInputStream 대신 ClassPathResource 사용 (파일 경로 문제 방지)
        ClassPathResource resource = new ClassPathResource("firebase-service-account.json");
        try (InputStream serviceAccount = resource.getInputStream()) {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setDatabaseUrl(System.getenv("FIREBASE_DATABASE_URL"))
// System.getenv("FIREBASE_DATABASE_URL")은 환경 변수 "FIREBASE_DATABASE_URL"의 값을 가져옵니다.
// 환경 변수를 사용하면 데이터베이스 URL을 코드에 직접 포함시키지 않고 외부에서 설정할 수 있어 보안성과 유연성을 높일 수 있습니다.
                    .build();

            // FirebaseApp 이름을 명시적으로 "DEFAULT"로 지정, 이미 초기화된 경우 기존 인스턴스 반환
            if (FirebaseApp.getApps().isEmpty()) {
                return FirebaseApp.initializeApp(options, "DEFAULT");
            } else {
                return FirebaseApp.getInstance("DEFAULT");
            }
        }
    }
}

