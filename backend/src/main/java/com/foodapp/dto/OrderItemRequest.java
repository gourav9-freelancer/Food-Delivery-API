package com.foodapp.dto;

public record OrderItemRequest(
    Long foodId,
    Integer quantity
) {}
