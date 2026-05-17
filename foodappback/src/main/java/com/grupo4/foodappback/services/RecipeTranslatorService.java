package com.grupo4.foodappback.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.grupo4.foodappback.dto.Meal;
import com.grupo4.foodappback.dto.MealResponse;

/* une tanto el servicio de recetas como el de traducción para traducir las recetas */
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

        String translatedIngredient = translationService.toEnglish(ingredient); // Traduce el texto para despues buscar
                                                                                // las recetas con el texto en Inglés.

        // 1. obtener recetas básicas
        MealResponse filtered = recipeService.getByIngredient(translatedIngredient);

        if (filtered == null || filtered.getMeals() == null) {
            return new MealResponse();
        }

        // 2. construir recetas completas
        List<Meal> fullMeals = filtered.getMeals()
                .stream()
                .limit(10)
                .map(meal -> {

                    MealResponse detail = recipeService.getById(meal.getIdMeal());

                    if (detail != null &&
                            detail.getMeals() != null &&
                            !detail.getMeals().isEmpty()) {

                        Meal fullMeal = detail.getMeals().get(0);
                        System.out.println(fullMeal.getStrMeal());

                        // 3. traducir (si quieres)
                        if (fullMeal.getStrMeal() != null) {
                            System.out.println(fullMeal.getStrMeal().length());
                            System.out.println(fullMeal.getStrMeal());
                            fullMeal.setStrMeal(
                                    translationService.toSpanish(fullMeal.getStrMeal())

                );
                        }

                        if (fullMeal.getStrInstructions() != null) {
                            fullMeal.setStrInstructions(
                                    translationService.toSpanish(fullMeal.getStrInstructions()));
                        }
                        System.out.println("Texto... ¿traducido?");
                        System.out.println("Meal traducido: " + fullMeal.getStrMeal());
                        System.out.println("Instructiones traducidas: " + fullMeal.getStrInstructions());
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