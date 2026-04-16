package com.foodapp.service;

import com.foodapp.dto.OrderItemRequest;
import com.foodapp.dto.OrderRequest;
import com.foodapp.dto.OrderResponse;
import com.foodapp.model.*;
import com.foodapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final FoodRepository foodRepository;

    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (OrderItemRequest itemRequest : request.items()) {
            Food food = foodRepository.findById(itemRequest.foodId())
                    .orElseThrow(() -> new RuntimeException("Food not found with id: " + itemRequest.foodId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setFood(food);
            orderItem.setQuantity(itemRequest.quantity());
            orderItem.setPrice(food.getPrice() * itemRequest.quantity());

            orderItems.add(orderItem);
            totalAmount += orderItem.getPrice();
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        return new OrderResponse(
                savedOrder.getId(),
                savedOrder.getTotalAmount(),
                savedOrder.getStatus(),
                savedOrder.getOrderDate()
        );
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Transactional
    public Order markAsPaid(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        order.setStatus("PAID");
        return orderRepository.save(order);
    }

    @Transactional
    public Order markAsDelivered(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        order.setStatus("DELIVERED");
        return orderRepository.save(order);
    }
}
