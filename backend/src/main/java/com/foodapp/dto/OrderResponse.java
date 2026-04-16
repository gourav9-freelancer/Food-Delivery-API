package com.foodapp.dto;

import java.time.LocalDateTime;

public record OrderResponse(
    Long orderId,
    Double totalAmount,
    String status,
    LocalDateTime orderDate
) {}
