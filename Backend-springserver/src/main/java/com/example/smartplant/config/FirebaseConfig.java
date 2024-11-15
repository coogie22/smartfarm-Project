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
        InputStream serviceAccount = resource.getInputStream();

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setDatabaseUrl("https://" + "smart-plant-monitoring-s-fc3c1.firebaseio.com")
                .build();

        // FirebaseApp 이름을 명시적으로 "DEFAULT"로 지정
        return FirebaseApp.initializeApp(options, "DEFAULT");
    }


}