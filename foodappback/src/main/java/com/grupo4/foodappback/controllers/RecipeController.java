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
import com.grupo4.foodappback.services.RecipeService;
import com.grupo4.foodappback.dto.MealResponse;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/recetas")
public class RecipeController {

    @Autowired
    private ProductService productService;

    @Autowired
    private RecipeService recipeService;

    // 🔥 Obtener todas las recetas (usamos pollo como búsqueda por defecto)
    @GetMapping
    public MealResponse getAllRecipes() {
        return recipeService.getByIngredient("chicken");
    }

    // 🔥 Buscar recetas por ingrediente
    @GetMapping("/buscar")
    public MealResponse searchByIngredient(@RequestParam String ingrediente) {
        return recipeService.getByIngredient(ingrediente);
    }

    /**
     * 🔥 RECETAS SUGERIDAS (SIMPLIFICADO)
     */
    @GetMapping("/sugeridas")
    public MealResponse getSuggestedRecipes(Authentication authentication) {
        if (authentication != null) {
            java.util.List<com.grupo4.foodappback.entities.Product> productos = productService.getProducts(authentication);
            
            // Intentar con los primeros 3 productos de la despensa
            for (int i = 0; i < Math.min(productos.size(), 3); i++) {
                String ing = productos.get(i).getName();
                MealResponse res = recipeService.getByIngredient(ing);
                if (res != null && res.getMeals() != null && !res.getMeals().isEmpty()) {
                    return res;
                }
            }
        }
        
        // Fallback final
        return recipeService.getByIngredient("chicken");
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