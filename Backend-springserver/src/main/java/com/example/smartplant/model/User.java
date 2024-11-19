package com.example.smartplant.model;

public class User { // 사용자 모델 클래스
    private String email; // 사용자 이메일
    private String password; // 사용자 비밀번호

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
