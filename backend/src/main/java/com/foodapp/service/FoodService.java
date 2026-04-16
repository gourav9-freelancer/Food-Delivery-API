package com.foodapp.service;

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
}
