package com.foodapp.dto;

public record RegisterRequest(
    String name,
    String email,
    String password
) {}
