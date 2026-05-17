package com.grupo4.foodappback.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.grupo4.foodappback.dto.Meal;
import com.grupo4.foodappback.dto.MealResponse;

@Service
public class RecipeTranslatorService {

    private final RecipeService recipeService;
    private final TranslationService translationService;

    public RecipeTranslatorService(
            RecipeService recipeService,
            TranslationService translationService) {
        this.recipeService = recipeService;
        this.translationService = translationService;
    }

    // Flujo completo: ingrediente → recetas completas → traducción
    public MealResponse getFullRecipesByIngredient(String ingredient) {

        // 1. Traducir el ingrediente buscado al inglés para que la API externa lo entienda
        String translatedIngredient = translationService.toEnglish(ingredient);

        // 2. Obtener recetas básicas por ese ingrediente
        MealResponse filtered = recipeService.getByIngredient(translatedIngredient);

        if (filtered == null || filtered.getMeals() == null) {
            return new MealResponse();
        }

        // 3. Construir recetas completas y traducirlas
        List<Meal> fullMeals = filtered.getMeals()
                .stream()
                .limit(10)
                .map(meal -> {
                    MealResponse detail = recipeService.getById(meal.getIdMeal());

                    if (detail != null && detail.getMeals() != null && !detail.getMeals().isEmpty()) {
                        Meal fullMeal = detail.getMeals().get(0);

                        // --- TRADUCCIÓN DE TÍTULO Y PREPARACIÓN ---
                        if (fullMeal.getStrMeal() != null) {
                            fullMeal.setStrMeal(translationService.toSpanish(fullMeal.getStrMeal()));
                        }
                        if (fullMeal.getStrInstructions() != null) {
                            fullMeal.setStrInstructions(translationService.toSpanish(fullMeal.getStrInstructions()));
                        }

                        // --- TRADUCCIÓN DE INGREDIENTES (uno por uno para que el diccionario funcione) ---
                        for (int i = 1; i <= 20; i++) {
                            try {
                                String ing = (String) fullMeal.getClass().getMethod("getStrIngredient" + i).invoke(fullMeal);
                                if (ing != null && !ing.isBlank()) {
                                    String traducido = translationService.toSpanish(ing);
                                    fullMeal.getClass().getMethod("setStrIngredient" + i, String.class)
                                            .invoke(fullMeal, traducido);
                                }
                            } catch (Exception e) { }
                        }

                        return fullMeal;
                    }
                    return null;
                })
                .filter(m -> m != null)
                .toList();

        MealResponse fullResponse = new MealResponse();
        fullResponse.setMeals(fullMeals);

        return fullResponse;
    }
}