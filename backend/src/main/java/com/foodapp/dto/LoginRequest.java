package com.foodapp.dto;

public record LoginRequest(
    String email,
    String password
) {}
