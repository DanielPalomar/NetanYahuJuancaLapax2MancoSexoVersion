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

    /**
     * FLUJO COMPLETO: INGREDIENTE → RECETAS COMPLETAS → TRADUCCIÓN
     * Este método es el responsable de que las recetas se vean en español aunque vengan de una API inglesa.
     */
    public MealResponse getFullRecipesByIngredient(String ingredient) {

        // 1. OBTENEMOS LAS RECETAS BÁSICAS
        // Buscamos los platos que contienen ese ingrediente (solo traen ID y Título)
        MealResponse filtered = recipeService.getByIngredient(ingredient);

        if (filtered == null || filtered.getMeals() == null) {
            return new MealResponse();
        }

        // 2. CONSTRUIMOS RECETAS COMPLETAS (CON PASOS E INSTRUCCIONES)
        List<Meal> fullMeals = filtered.getMeals()
                .stream()
                .limit(10) // Limitamos a 10 para no saturar la conexión
                .map(meal -> {

                    // Buscamos el detalle completo de cada plato por su ID
                    MealResponse detail = recipeService.getById(meal.getIdMeal());

                    if (detail != null &&
                        detail.getMeals() != null &&
                        !detail.getMeals().isEmpty()) {

                        Meal fullMeal = detail.getMeals().get(0);

                        /**
                         * 3. TRADUCCIÓN ESTRATÉGICA (CON SEGURIDAD)
                         * Intentamos traducir título e instrucciones. Si el traductor falla, 
                         * capturamos el error para que la receta se muestre al menos en original.
                         */
                        try {
                            if (fullMeal.getStrMeal() != null) {
                                String traducido = translationService.toSpanish(fullMeal.getStrMeal());
                                if (traducido != null) fullMeal.setStrMeal(traducido);
                            }
    
                            if (fullMeal.getStrInstructions() != null) {
                                String traducidoInstr = translationService.toSpanish(fullMeal.getStrInstructions());
                                if (traducidoInstr != null) fullMeal.setStrInstructions(traducidoInstr);
                            }
                        } catch (Exception e) {
                            System.out.println("Aviso: Falló la traducción de una receta, se mostrará en original.");
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