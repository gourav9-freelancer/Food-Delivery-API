package com.foodapp.controller;

import com.foodapp.dto.OrderRequest;
import com.foodapp.dto.OrderResponse;
import com.foodapp.model.Order;
import com.foodapp.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@RequestBody OrderRequest request) {
        OrderResponse order = orderService.placeOrder(request);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrderHistory(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    @PutMapping("/{orderId}/pay")
    public Order markAsPaid(@PathVariable Long orderId) {
        return orderService.markAsPaid(orderId);
    }

    @PutMapping("/{orderId}/deliver")
    public Order markAsDelivered(@PathVariable Long orderId) {
        return orderService.markAsDelivered(orderId);
    }
}
