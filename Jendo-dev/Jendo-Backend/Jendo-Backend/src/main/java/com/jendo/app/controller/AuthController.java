package com.jendo.app.controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jendo.app.domain.user.dto.UserRequestDto;
import com.jendo.app.domain.user.entity.OtpToken;
import com.jendo.app.domain.user.repository.OtpTokenRepository;
import com.jendo.app.domain.user.service.EmailService;
import com.jendo.app.domain.user.service.UserService;
import com.jendo.app.security.JwtUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final EmailService emailService;
    private final OtpTokenRepository otpRepo;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;


    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);
        OtpToken token = new OtpToken();
        token.setEmail(email);
        token.setOtp(otp);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        otpRepo.deleteByEmail(email);
        otpRepo.save(token);
        emailService.sendOtpEmail(email, otp);
        return ResponseEntity.ok(Map.of("success", true, "message", "OTP sent"));
    }

    @PostMapping("/verify-otp")
    @Transactional
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String otp = req.get("otp");
        Optional<OtpToken> tokenOpt = otpRepo.findByEmailAndOtp(email, otp);
        if (tokenOpt.isPresent() && tokenOpt.get().getExpiresAt().isAfter(LocalDateTime.now())) {
            otpRepo.deleteByEmail(email);
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.status(400).body(Map.of("success", false, "message", "Invalid or expired OTP"));
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String password = req.get("password");
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
            var user = userService.getUserByEmail(email);
            String token = jwtUtil.generateToken(email, user.getId());
            return ResponseEntity.ok(Map.of("token", token, "userId", user.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserRequestDto req) {
        var createdUser = userService.createUser(req);
        String token = jwtUtil.generateToken(createdUser.getEmail(), createdUser.getId());
        return ResponseEntity.ok(Map.of("token", token, "userId", createdUser.getId()));
    }


}
