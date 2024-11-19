package com.example.smartplant.controller;

import com.example.smartplant.model.User;
import com.example.smartplant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users") // API 엔드포인트
@CrossOrigin(origins = "*") // 모든 origin 허용 -> 프론트엔드와 연동할 때 발생할 수 있는 CORS 문제를 방지
public class UserController { // 새로운 사용자 관리 API

    @Autowired
    private UserService userService;

    // 회원가입 API
    @PostMapping("/register")  // API 엔드포인트
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        try {
            String result = userService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    // 로그인 API
    @PostMapping("/login")  // API 엔드포인트
    public ResponseEntity<String> loginUser(@RequestBody User user) {
        try {
            String token = userService.loginUserWithCredentials(user.getEmail(), user.getPassword());
            return ResponseEntity.ok(token); // 성공 시 토큰 반환
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("Email")) { // 사용자가 유효하지 않은 이메일 형식을 입력한 경우
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 이메일 형식입니다.");
            } else if (e.getMessage().contains("Password")) { // 등록된 사용자의 이메일과 일치하지만 비밀번호가 틀린 경우
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호가 잘못되었습니다.");
            } else { // 등록되지 않은 이메일로 로그인을 시도하는 경우
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("로그인 정보가 올바르지 않습니다.");
            }
        } catch (Exception e) { // Firebase Authentication 서버와 통신 중 오류가 발생하는 경우
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }
}
