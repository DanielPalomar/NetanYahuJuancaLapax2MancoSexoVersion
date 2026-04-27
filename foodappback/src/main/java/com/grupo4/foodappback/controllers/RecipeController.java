package com.grupo4.foodappback.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import com.grupo4.foodappback.services.ProductService;
import com.grupo4.foodappback.dto.MealResponse;
import com.grupo4.foodappback.services.RecipeTranslatorService;
import com.grupo4.foodappback.services.TranslationService;

// ESTE CONTROLLER SOLO USA EL SERVICIO RecipeTranslatorService:
//=============================================================


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/recetas")
public class RecipeController {

    @Autowired
    private RecipeTranslatorService recipeTranslatorService;

    @Autowired
    private TranslationService translationService;

    @Autowired
    private ProductService productService;

    @Autowired
    private com.grupo4.foodappback.services.RecipeService recipeService;

    // 🔥 Obtener todas las recetas (usamos pollo como búsqueda por defecto)
    @GetMapping
    public MealResponse getAllRecipes() {
        return recipeTranslatorService.getFullRecipesByIngredient("chicken");
    }

    // 🔥 Buscar recetas por ingrediente
    @GetMapping("/buscar")
    public MealResponse searchByIngredient(@RequestParam String ingrediente) {
        return recipeTranslatorService.getFullRecipesByIngredient(ingrediente);
    }

    /**
     * 🔥 RECETAS SUGERIDAS (EL CEREBRO DEL SISTEMA)
     * Este endpoint analiza la despensa del usuario y recomienda platos reales.
     */
    @GetMapping("/sugeridas")
    public MealResponse getSuggestedRecipes(Authentication authentication) {
        String ingredienteSugerido = "chicken"; // Plan B: Pollo siempre es una buena opción
        
        if (authentication != null) {
            // 1. Obtenemos los productos reales que el usuario tiene en su despensa
            java.util.List<com.grupo4.foodappback.entities.Product> productos = productService.getProducts(authentication);
            
            if (!productos.isEmpty()) {
                /**
                 * 2. ESTRATEGIA DE TRADUCCIÓN:
                 * La base de datos de recetas (TheMealDB) está en inglés. Si buscamos "leche" no sale nada.
                 * Por eso, traducimos el nombre del producto al inglés antes de lanzar la búsqueda.
                 */
                String nombreOriginal = productos.get(0).getName();
                ingredienteSugerido = translationService.toEnglish(nombreOriginal);
                
                // Si la traducción falla, usamos el nombre original por si acaso
                if (ingredienteSugerido == null) ingredienteSugerido = nombreOriginal;
            }
        }
        
        // 3. Consultamos la API externa usando el ingrediente ya en inglés
        com.grupo4.foodappback.dto.MealResponse res = recipeTranslatorService.getFullRecipesByIngredient(ingredienteSugerido);
        
        /**
         * 4. CONTROL DE VACÍOS (FALLBACK):
         * Si para tu ingrediente específico no hay recetas en la base de datos, 
         * buscamos "chicken" (pollo) para que la página nunca se vea vacía y triste.
         */
        if (res == null || res.getMeals() == null || res.getMeals().isEmpty()) {
            res = recipeTranslatorService.getFullRecipesByIngredient("chicken");
        }
        
        return res;
    }

    // 🔥 Detalle de receta por ID
    @GetMapping("/{id}")
    public com.grupo4.foodappback.dto.Meal getRecipeDetail(@PathVariable String id) {
        MealResponse response = recipeService.getById(id);
        if (response != null && response.getMeals() != null && !response.getMeals().isEmpty()) {
            return response.getMeals().get(0);
        }
        return null;
    }
}