package com.foodapp.controller;

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
}
