package com.foodapp.controller;

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
}
