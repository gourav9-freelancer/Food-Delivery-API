export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  language?: string;
  badge?: string;
}

export const fileTree: FileNode[] = [
  {
    name: 'src/main/java/com/foodapp',
    path: 'src/main/java/com/foodapp',
    type: 'folder',
    children: [
      {
        name: 'FoodDeliveryApplication.java',
        path: 'FoodDeliveryApplication.java',
        type: 'file',
        language: 'java',
        badge: 'Main',
        content: `package com.foodapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FoodDeliveryApplication {
    public static void main(String[] args) {
        SpringApplication.run(FoodDeliveryApplication.class, args);
    }
}`
      },
      {
        name: 'controller/',
        path: 'controller',
        type: 'folder',
        children: [
          {
            name: 'AuthController.java',
            path: 'controller/AuthController.java',
            type: 'file',
            language: 'java',
            badge: 'REST',
            content: `package com.foodapp.controller;

import com.foodapp.dto.LoginRequest;
import com.foodapp.dto.RegisterRequest;
import com.foodapp.model.User;
import com.foodapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }
}`
          },
          {
            name: 'RestaurantController.java',
            path: 'controller/RestaurantController.java',
            type: 'file',
            language: 'java',
            badge: 'REST',
            content: `package com.foodapp.controller;

import com.foodapp.model.Restaurant;
import com.foodapp.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/restaurants")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return restaurantService.getAll();
    }

    @GetMapping("/{id}")
    public Restaurant getRestaurant(@PathVariable Long id) {
        return restaurantService.getById(id);
    }

    @PostMapping
    public ResponseEntity<Restaurant> createRestaurant(@RequestBody Restaurant restaurant) {
        return ResponseEntity.ok(restaurantService.create(restaurant));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(
            @PathVariable Long id,
            @RequestBody Restaurant restaurant) {
        return ResponseEntity.ok(restaurantService.update(id, restaurant));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id) {
        restaurantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}`
          },
          {
            name: 'FoodController.java',
            path: 'controller/FoodController.java',
            type: 'file',
            language: 'java',
            badge: 'REST',
            content: `package com.foodapp.controller;

import com.foodapp.model.Food;
import com.foodapp.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/foods")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FoodController {

    private final FoodService foodService;

    @GetMapping
    public List<Food> getAllFoods() {
        return foodService.getAll();
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<Food> getMenu(@PathVariable Long restaurantId) {
        return foodService.getByRestaurantId(restaurantId);
    }

    @GetMapping("/{id}")
    public Food getFood(@PathVariable Long id) {
        return foodService.getById(id);
    }

    @PostMapping
    public ResponseEntity<Food> createFood(@RequestBody Food food) {
        return ResponseEntity.ok(foodService.create(food));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFood(@PathVariable Long id) {
        foodService.delete(id);
        return ResponseEntity.noContent().build();
    }
}`
          },
          {
            name: 'OrderController.java',
            path: 'controller/OrderController.java',
            type: 'file',
            language: 'java',
            badge: 'REST',
            content: `package com.foodapp.controller;

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
}`
          },
        ],
      },
      {
        name: 'service/',
        path: 'service',
        type: 'folder',
        children: [
          {
            name: 'UserService.java',
            path: 'service/UserService.java',
            type: 'file',
            language: 'java',
            badge: 'Service',
            content: `package com.foodapp.service;

import com.foodapp.config.JwtService;
import com.foodapp.dto.LoginRequest;
import com.foodapp.dto.RegisterRequest;
import com.foodapp.model.User;
import com.foodapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole("USER");

        return userRepository.save(user);
    }

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return jwtService.generateToken(user.getEmail());
    }
}`
          },
          {
            name: 'RestaurantService.java',
            path: 'service/RestaurantService.java',
            type: 'file',
            language: 'java',
            badge: 'Service',
            content: `package com.foodapp.service;

import com.foodapp.model.Restaurant;
import com.foodapp.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public List<Restaurant> getAll() {
        return restaurantRepository.findAll();
    }

    public Restaurant getById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
    }

    public Restaurant create(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public Restaurant update(Long id, Restaurant restaurant) {
        Restaurant existing = getById(id);
        existing.setName(restaurant.getName());
        existing.setAddress(restaurant.getAddress());
        existing.setPhone(restaurant.getPhone());
        return restaurantRepository.save(existing);
    }

    public void delete(Long id) {
        restaurantRepository.deleteById(id);
    }
}`
          },
          {
            name: 'FoodService.java',
            path: 'service/FoodService.java',
            type: 'file',
            language: 'java',
            badge: 'Service',
            content: `package com.foodapp.service;

import com.foodapp.model.Food;
import com.foodapp.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodService {

    private final FoodRepository foodRepository;

    public List<Food> getAll() {
        return foodRepository.findAll();
    }

    public List<Food> getByRestaurantId(Long restaurantId) {
        return foodRepository.findByRestaurantId(restaurantId);
    }

    public Food getById(Long id) {
        return foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food not found with id: " + id));
    }

    public Food create(Food food) {
        return foodRepository.save(food);
    }

    public void delete(Long id) {
        foodRepository.deleteById(id);
    }
}`
          },
          {
            name: 'OrderService.java',
            path: 'service/OrderService.java',
            type: 'file',
            language: 'java',
            badge: 'Service',
            content: `package com.foodapp.service;

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
                    .orElseThrow(() -> new RuntimeException(
                        "Food not found with id: " + itemRequest.foodId()));

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
                .orElseThrow(() -> new RuntimeException(
                    "Order not found with id: " + orderId));
        order.setStatus("PAID");
        return orderRepository.save(order);
    }

    @Transactional
    public Order markAsDelivered(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException(
                    "Order not found with id: " + orderId));
        order.setStatus("DELIVERED");
        return orderRepository.save(order);
    }
}`
          },
        ],
      },
      {
        name: 'repository/',
        path: 'repository',
        type: 'folder',
        children: [
          {
            name: 'UserRepository.java',
            path: 'repository/UserRepository.java',
            type: 'file',
            language: 'java',
            badge: 'JPA',
            content: `package com.foodapp.repository;

import com.foodapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}`
          },
          {
            name: 'RestaurantRepository.java',
            path: 'repository/RestaurantRepository.java',
            type: 'file',
            language: 'java',
            badge: 'JPA',
            content: `package com.foodapp.repository;

import com.foodapp.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
}`
          },
          {
            name: 'FoodRepository.java',
            path: 'repository/FoodRepository.java',
            type: 'file',
            language: 'java',
            badge: 'JPA',
            content: `package com.foodapp.repository;

import com.foodapp.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    List<Food> findByRestaurantId(Long restaurantId);
}`
          },
          {
            name: 'OrderRepository.java',
            path: 'repository/OrderRepository.java',
            type: 'file',
            language: 'java',
            badge: 'JPA',
            content: `package com.foodapp.repository;

import com.foodapp.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
}`
          },
          {
            name: 'OrderItemRepository.java',
            path: 'repository/OrderItemRepository.java',
            type: 'file',
            language: 'java',
            badge: 'JPA',
            content: `package com.foodapp.repository;

import com.foodapp.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}`
          },
        ],
      },
      {
        name: 'model/',
        path: 'model',
        type: 'folder',
        children: [
          {
            name: 'User.java',
            path: 'model/User.java',
            type: 'file',
            language: 'java',
            badge: 'Entity',
            content: `package com.foodapp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    private String role = "USER"; // USER or ADMIN
}`
          },
          {
            name: 'Restaurant.java',
            path: 'model/Restaurant.java',
            type: 'file',
            language: 'java',
            badge: 'Entity',
            content: `package com.foodapp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String address;

    private String phone;
}`
          },
          {
            name: 'Food.java',
            path: 'model/Food.java',
            type: 'file',
            language: 'java',
            badge: 'Entity',
            content: `package com.foodapp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private Double price;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;
}`
          },
          {
            name: 'Order.java',
            path: 'model/Order.java',
            type: 'file',
            language: 'java',
            badge: 'Entity',
            content: `package com.foodapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Double totalAmount;

    private String status = "PENDING"; // PENDING, PAID, DELIVERED

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items = new ArrayList<>();

    private LocalDateTime orderDate = LocalDateTime.now();
}`
          },
          {
            name: 'OrderItem.java',
            path: 'model/OrderItem.java',
            type: 'file',
            language: 'java',
            badge: 'Entity',
            content: `package com.foodapp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "food_id")
    private Food food;

    private Integer quantity;

    private Double price;
}`
          },
        ],
      },
      {
        name: 'dto/',
        path: 'dto',
        type: 'folder',
        children: [
          {
            name: 'RegisterRequest.java',
            path: 'dto/RegisterRequest.java',
            type: 'file',
            language: 'java',
            badge: 'DTO',
            content: `package com.foodapp.dto;

public record RegisterRequest(
    String name,
    String email,
    String password
) {}`
          },
          {
            name: 'LoginRequest.java',
            path: 'dto/LoginRequest.java',
            type: 'file',
            language: 'java',
            badge: 'DTO',
            content: `package com.foodapp.dto;

public record LoginRequest(
    String email,
    String password
) {}`
          },
          {
            name: 'OrderRequest.java',
            path: 'dto/OrderRequest.java',
            type: 'file',
            language: 'java',
            badge: 'DTO',
            content: `package com.foodapp.dto;

import java.util.List;

public record OrderRequest(
    Long userId,
    List<OrderItemRequest> items
) {}`
          },
          {
            name: 'OrderItemRequest.java',
            path: 'dto/OrderItemRequest.java',
            type: 'file',
            language: 'java',
            badge: 'DTO',
            content: `package com.foodapp.dto;

public record OrderItemRequest(
    Long foodId,
    Integer quantity
) {}`
          },
          {
            name: 'OrderResponse.java',
            path: 'dto/OrderResponse.java',
            type: 'file',
            language: 'java',
            badge: '⭐ DTO',
            content: `package com.foodapp.dto;

import java.time.LocalDateTime;

public record OrderResponse(
    Long orderId,
    Double totalAmount,
    String status,
    LocalDateTime orderDate
) {}`
          },
        ],
      },
      {
        name: 'config/',
        path: 'config',
        type: 'folder',
        children: [
          {
            name: 'JwtService.java',
            path: 'config/JwtService.java',
            type: 'file',
            language: 'java',
            badge: 'Security',
            content: `package com.foodapp.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("\${jwt.secret}")
    private String secretKey;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(String username) {
        return generateToken(new HashMap<>(), username);
    }

    public String generateToken(Map<String, Object> extraClaims, String username) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username)) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}`
          },
          {
            name: 'SecurityConfig.java',
            path: 'config/SecurityConfig.java',
            type: 'file',
            language: 'java',
            badge: 'Security',
            content: `package com.foodapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/restaurants/**", "/foods/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}`
          },
        ],
      },
      {
        name: 'exception/',
        path: 'exception',
        type: 'folder',
        children: [
          {
            name: 'GlobalExceptionHandler.java',
            path: 'exception/GlobalExceptionHandler.java',
            type: 'file',
            language: 'java',
            badge: 'Handler',
            content: `package com.foodapp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now().toString());
        error.put("message", ex.getMessage());
        error.put("status", HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now().toString());
        error.put("message", "An unexpected error occurred");
        error.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}`
          },
        ],
      },
    ],
  },
  {
    name: 'pom.xml',
    path: 'pom.xml',
    type: 'file',
    language: 'xml',
    badge: 'Maven',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>

    <groupId>com.foodapp</groupId>
    <artifactId>food-delivery</artifactId>
    <version>1.0.0</version>
    <name>Food Delivery Application</name>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.2.0</version>
        </dependency>
    </dependencies>
</project>`
  },
  {
    name: 'application.yml',
    path: 'application.yml',
    type: 'file',
    language: 'yaml',
    badge: 'Config',
    content: `spring:
  datasource:
    url: jdbc:mysql://localhost:3306/fooddb
    username: root
    password: yourpassword
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect

jwt:
  secret: dGhpcy1pcy1hLXZlcnktbG9uZy1zZWNyZXQta2V5LWZvci1qd3QtdG9rZW4tZ2VuZXJhdGlvbg==

server:
  port: 8080`
  },
];

export const apiEndpoints = [
  { method: 'POST', path: '/auth/register', desc: 'Register new user', color: 'bg-green-500' },
  { method: 'POST', path: '/auth/login', desc: 'Login & get JWT token', color: 'bg-green-500' },
  { method: 'GET', path: '/restaurants', desc: 'List all restaurants', color: 'bg-blue-500' },
  { method: 'GET', path: '/restaurants/{id}', desc: 'Get restaurant by ID', color: 'bg-blue-500' },
  { method: 'POST', path: '/restaurants', desc: 'Create restaurant', color: 'bg-green-500' },
  { method: 'PUT', path: '/restaurants/{id}', desc: 'Update restaurant', color: 'bg-yellow-500' },
  { method: 'DELETE', path: '/restaurants/{id}', desc: 'Delete restaurant', color: 'bg-red-500' },
  { method: 'GET', path: '/foods', desc: 'List all foods', color: 'bg-blue-500' },
  { method: 'GET', path: '/foods/restaurant/{id}', desc: 'Get menu by restaurant', color: 'bg-blue-500' },
  { method: 'POST', path: '/foods', desc: 'Add food item', color: 'bg-green-500' },
  { method: 'POST', path: '/orders', desc: 'Place new order', color: 'bg-green-500' },
  { method: 'GET', path: '/orders/user/{userId}', desc: 'Order history', color: 'bg-blue-500' },
  { method: 'PUT', path: '/orders/{id}/pay', desc: 'Mark order as paid', color: 'bg-yellow-500' },
  { method: 'PUT', path: '/orders/{id}/deliver', desc: 'Mark as delivered', color: 'bg-yellow-500' },
];

export const features = [
  { name: 'User Register/Login', icon: '👤', done: true },
  { name: 'JWT Authentication', icon: '🔐', done: true },
  { name: 'Restaurant CRUD', icon: '🏪', done: true },
  { name: 'Food Menu per Restaurant', icon: '🍔', done: true },
  { name: 'Place Order with Items', icon: '📦', done: true },
  { name: 'Auto Total Calculation', icon: '💰', done: true },
  { name: 'Order History', icon: '📋', done: true },
  { name: 'Payment Simulation', icon: '💳', done: true },
  { name: 'Clean Layered Architecture', icon: '🏗️', done: true },
  { name: 'Swagger Documentation', icon: '📖', done: true },
  { name: 'Global Exception Handling', icon: '⚠️', done: true },
];
