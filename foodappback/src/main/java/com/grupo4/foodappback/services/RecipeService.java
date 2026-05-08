package com.grupo4.foodappback.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.grupo4.foodappback.dto.Meal;
import com.grupo4.foodappback.dto.MealResponse;

@Service
public class RecipeService {

    private final RecipeClient recipeClient;
    private final TranslationService translationService;

    public RecipeService(RecipeClient recipeClient, TranslationService translationService) {
        this.recipeClient = recipeClient;
        this.translationService = translationService;
    }

    // 🔹 Buscar recetas por ingrediente (con detalles completos para sugerencias)
    public MealResponse getByIngredient(String ingredient) {
        String englishIngredient = translationService.translate(ingredient, "es", "en");
        MealResponse response = recipeClient.byIngredient(englishIngredient);

        if (response == null || response.getMeals() == null || response.getMeals().isEmpty()) {
            return new MealResponse();
        }

        // Para las 5 primeras, obtenemos el detalle completo para tener los ingredientes
        List<Meal> detailedMeals = response.getMeals()
                .stream()
                .limit(5)
                .map(m -> {
                    MealResponse detail = getById(m.getIdMeal());
                    if (detail != null && detail.getMeals() != null && !detail.getMeals().isEmpty()) {
                        return detail.getMeals().get(0);
                    }
                    return m;
                })
                .toList();

        response.setMeals(detailedMeals);
        return response;
    }

    // 🔹 Buscar receta completa por ID
    public MealResponse getById(String id) {
        MealResponse response = recipeClient.byId(id);

        if (response != null && response.getMeals() != null) {
            for (Meal meal : response.getMeals()) {
                if (meal.getStrMeal() != null) {
                    meal.setStrMeal(translationService.translate(meal.getStrMeal(), "en", "es"));
                }
                if (meal.getStrInstructions() != null) {
                    meal.setStrInstructions(translationService.translate(meal.getStrInstructions(), "en", "es"));
                }
                // Traducir la lista de ingredientes usando el método batch
                List<String> ingredientes = meal.getIngredientes();
                if (ingredientes != null && !ingredientes.isEmpty()) {
                    List<String> traducidos = translationService.translateList(ingredientes, "en", "es");
                    meal.setIngredientes(traducidos);
                }
            }
        }

        return response;
    }
}