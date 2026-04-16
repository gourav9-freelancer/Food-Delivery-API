package com.foodapp.service;

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
}
