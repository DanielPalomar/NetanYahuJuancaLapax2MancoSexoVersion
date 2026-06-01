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

    // Método para simplificar el ingrediente introducido por el usuario (normalmente con marca o descriptores largos)
    // a un ingrediente simple en inglés que sea admitido y tenga recetas en la API TheMealDB.
    private String simplifyIngredient(String ingredient) {
        if (ingredient == null || ingredient.isBlank()) {
            return null;
        }

        String lower = ingredient.toLowerCase().trim();

        // Mapeo simple: si el nombre del producto en la despensa contiene alguna de estas palabras, 
        // buscamos por la palabra clave en inglés correspondiente.
        if (lower.contains("pollo")) return "chicken";
        if (lower.contains("ternera") || lower.contains("vaca") || lower.contains("buey") || lower.contains("carne")) return "beef";
        if (lower.contains("cerdo") || lower.contains("pork") || lower.contains("jamon") || lower.contains("jamón") || lower.contains("lomo")) return "pork";
        if (lower.contains("arroz")) return "rice";
        if (lower.contains("cebolla")) return "onion";
        if (lower.contains("tomate")) return "tomato";
        if (lower.contains("ajo")) return "garlic";
        if (lower.contains("merluza") || lower.contains("pescado") || lower.contains("salmon") || lower.contains("salmón") || lower.contains("bacalao")) return "fish";
        if (lower.contains("atun") || lower.contains("atún")) return "tuna";
        if (lower.contains("huevo")) return "egg";
        if (lower.contains("leche")) return "milk";
        if (lower.contains("queso")) return "cheese";
        if (lower.contains("mantequilla")) return "butter";
        if (lower.contains("harina")) return "flour";
        if (lower.contains("pasta") || lower.contains("tallarin") || lower.contains("tallarín") || lower.contains("macarron") || lower.contains("macarrón") || lower.contains("espagueti") || lower.contains("fideo")) return "pasta";
        if (lower.contains("patata") || lower.contains("papa")) return "potato";
        if (lower.contains("pan")) return "bread";
        if (lower.contains("aceite")) return "oil";
        if (lower.contains("limon") || lower.contains("limón")) return "lemon";
        if (lower.contains("zanahoria")) return "carrot";
        if (lower.contains("manzana")) return "apple";
        if (lower.contains("platano") || lower.contains("plátano")) return "banana";
        if (lower.contains("fresa")) return "strawberry";
        if (lower.contains("naranja")) return "orange";
        if (lower.contains("azucar") || lower.contains("azúcar")) return "sugar";
        if (lower.contains("sal")) return "salt";
        if (lower.contains("pimienta")) return "pepper";
        if (lower.contains("champi") || lower.contains("seta")) return "mushrooms";
        if (lower.contains("espinaca")) return "spinach";
        if (lower.contains("brocoli") || lower.contains("brócoli")) return "broccoli";

        return null; // Si no hay coincidencia directa, dejamos que se traduzca normalmente
    }

    // Flujo completo: ingrediente → recetas completas → traducción
    public MealResponse getFullRecipesByIngredient(String ingredient) {

        // 1. Intentamos buscar una palabra clave simplificada para el ingrediente (ej: "Pechuga de pollo" -> "chicken")
        String simplifiedIngredient = simplifyIngredient(ingredient);
        MealResponse filtered = null;

        if (simplifiedIngredient != null) {
            filtered = recipeService.getByIngredient(simplifiedIngredient);
        }

        // 2. Si no hubo coincidencia o la búsqueda simplificada no trajo resultados, traducimos el texto completo
        if (filtered == null || filtered.getMeals() == null || filtered.getMeals().isEmpty()) {
            String translatedIngredient = translationService.toEnglish(ingredient);
            filtered = recipeService.getByIngredient(translatedIngredient);
        }

        // 3. Si sigue vacío, intentamos traduciendo únicamente la primera palabra del producto (ej: "Arroz bomba" -> "Arroz" -> "Rice")
        if (filtered == null || filtered.getMeals() == null || filtered.getMeals().isEmpty()) {
            if (ingredient != null && !ingredient.isBlank()) {
                String firstWord = ingredient.trim().split("\\s+")[0];
                String translatedFirstWord = translationService.toEnglish(firstWord);
                filtered = recipeService.getByIngredient(translatedFirstWord);
            }
        }

        // 4. Si después de todos los intentos no hay recetas, usamos un ingrediente comodín ("chicken" / pollo)
        // para garantizar que siempre se muestren recetas al usuario ("mostrar recetas de todo")
        if (filtered == null || filtered.getMeals() == null || filtered.getMeals().isEmpty()) {
            filtered = recipeService.getByIngredient("chicken");
        }

        if (filtered == null || filtered.getMeals() == null) {
            return new MealResponse();
        }

        // 5. Construir recetas completas y traducir todos los campos al español
        List<Meal> fullMeals = filtered.getMeals()
                .stream()
                .limit(10)
                .map(meal -> {

                    MealResponse detail = recipeService.getById(meal.getIdMeal());

                    if (detail != null &&
                            detail.getMeals() != null &&
                            !detail.getMeals().isEmpty()) {

                        Meal fullMeal = detail.getMeals().get(0);

                        // Traducir el título de la receta al español
                        if (fullMeal.getStrMeal() != null) {
                            fullMeal.setStrMeal(translationService.toSpanish(fullMeal.getStrMeal()));
                        }

                        // Traducir las instrucciones de preparación al español
                        if (fullMeal.getStrInstructions() != null) {
                            fullMeal.setStrInstructions(translationService.toSpanish(fullMeal.getStrInstructions()));
                        }

                        // Traducir los 20 campos de ingredientes al español
                        if (fullMeal.getStrIngredient1() != null && !fullMeal.getStrIngredient1().isBlank()) {
                            fullMeal.setStrIngredient1(translationService.toSpanish(fullMeal.getStrIngredient1()));
                        }
                        if (fullMeal.getStrIngredient2() != null && !fullMeal.getStrIngredient2().isBlank()) {
                            fullMeal.setStrIngredient2(translationService.toSpanish(fullMeal.getStrIngredient2()));
                        }
                        if (fullMeal.getStrIngredient3() != null && !fullMeal.getStrIngredient3().isBlank()) {
                            fullMeal.setStrIngredient3(translationService.toSpanish(fullMeal.getStrIngredient3()));
                        }
                        if (fullMeal.getStrIngredient4() != null && !fullMeal.getStrIngredient4().isBlank()) {
                            fullMeal.setStrIngredient4(translationService.toSpanish(fullMeal.getStrIngredient4()));
                        }
                        if (fullMeal.getStrIngredient5() != null && !fullMeal.getStrIngredient5().isBlank()) {
                            fullMeal.setStrIngredient5(translationService.toSpanish(fullMeal.getStrIngredient5()));
                        }
                        if (fullMeal.getStrIngredient6() != null && !fullMeal.getStrIngredient6().isBlank()) {
                            fullMeal.setStrIngredient6(translationService.toSpanish(fullMeal.getStrIngredient6()));
                        }
                        if (fullMeal.getStrIngredient7() != null && !fullMeal.getStrIngredient7().isBlank()) {
                            fullMeal.setStrIngredient7(translationService.toSpanish(fullMeal.getStrIngredient7()));
                        }
                        if (fullMeal.getStrIngredient8() != null && !fullMeal.getStrIngredient8().isBlank()) {
                            fullMeal.setStrIngredient8(translationService.toSpanish(fullMeal.getStrIngredient8()));
                        }
                        if (fullMeal.getStrIngredient9() != null && !fullMeal.getStrIngredient9().isBlank()) {
                            fullMeal.setStrIngredient9(translationService.toSpanish(fullMeal.getStrIngredient9()));
                        }
                        if (fullMeal.getStrIngredient10() != null && !fullMeal.getStrIngredient10().isBlank()) {
                            fullMeal.setStrIngredient10(translationService.toSpanish(fullMeal.getStrIngredient10()));
                        }
                        if (fullMeal.getStrIngredient11() != null && !fullMeal.getStrIngredient11().isBlank()) {
                            fullMeal.setStrIngredient11(translationService.toSpanish(fullMeal.getStrIngredient11()));
                        }
                        if (fullMeal.getStrIngredient12() != null && !fullMeal.getStrIngredient12().isBlank()) {
                            fullMeal.setStrIngredient12(translationService.toSpanish(fullMeal.getStrIngredient12()));
                        }
                        if (fullMeal.getStrIngredient13() != null && !fullMeal.getStrIngredient13().isBlank()) {
                            fullMeal.setStrIngredient13(translationService.toSpanish(fullMeal.getStrIngredient13()));
                        }
                        if (fullMeal.getStrIngredient14() != null && !fullMeal.getStrIngredient14().isBlank()) {
                            fullMeal.setStrIngredient14(translationService.toSpanish(fullMeal.getStrIngredient14()));
                        }
                        if (fullMeal.getStrIngredient15() != null && !fullMeal.getStrIngredient15().isBlank()) {
                            fullMeal.setStrIngredient15(translationService.toSpanish(fullMeal.getStrIngredient15()));
                        }
                        if (fullMeal.getStrIngredient16() != null && !fullMeal.getStrIngredient16().isBlank()) {
                            fullMeal.setStrIngredient16(translationService.toSpanish(fullMeal.getStrIngredient16()));
                        }
                        if (fullMeal.getStrIngredient17() != null && !fullMeal.getStrIngredient17().isBlank()) {
                            fullMeal.setStrIngredient17(translationService.toSpanish(fullMeal.getStrIngredient17()));
                        }
                        if (fullMeal.getStrIngredient18() != null && !fullMeal.getStrIngredient18().isBlank()) {
                            fullMeal.setStrIngredient18(translationService.toSpanish(fullMeal.getStrIngredient18()));
                        }
                        if (fullMeal.getStrIngredient19() != null && !fullMeal.getStrIngredient19().isBlank()) {
                            fullMeal.setStrIngredient19(translationService.toSpanish(fullMeal.getStrIngredient19()));
                        }
                        if (fullMeal.getStrIngredient20() != null && !fullMeal.getStrIngredient20().isBlank()) {
                            fullMeal.setStrIngredient20(translationService.toSpanish(fullMeal.getStrIngredient20()));
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