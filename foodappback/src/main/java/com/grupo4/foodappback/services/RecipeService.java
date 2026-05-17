package com.grupo4.foodappback.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.grupo4.foodappback.dto.Meal;
import com.grupo4.foodappback.dto.MealResponse;

@Service
public class RecipeService {

    private final RecipeClient recipeClient;

    public RecipeService(RecipeClient recipeClient) {
        this.recipeClient = recipeClient;
    }

    // Buscar recetas por ingrediente (lista básica)
    public MealResponse getByIngredient(String ingredient) {

        MealResponse response = recipeClient.byIngredient(ingredient);

        if (response == null || response.getMeals() == null) {
            return new MealResponse();
        }

        List<Meal> limited = response.getMeals()
                .stream()
                .limit(5)
                .toList();

        response.setMeals(limited);

        return response;
    }

    // Buscar receta completa por ID
    public MealResponse getById(String id) {
        return recipeClient.byId(id);
    }
}