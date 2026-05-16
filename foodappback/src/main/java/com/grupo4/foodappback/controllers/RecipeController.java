package com.grupo4.foodappback.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.grupo4.foodappback.dto.MealResponse;
import com.grupo4.foodappback.services.RecipeTranslatorService;

// ESTE CONTROLLER SOLO USA EL SERVICIO RecipeTranslatorService:
//=============================================================


@CrossOrigin(origins = "http://localhost:5500")
@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    private RecipeTranslatorService recipeTranslatorService;

    // 🔥 Buscar recetas por ingrediente (ya traducidas y completas)
    @GetMapping("/ingredients")
    public MealResponse getRecipesByIngredient(@RequestParam("ingredient") String ingredient) {
        return recipeTranslatorService.getFullRecipesByIngredient(ingredient);
    }
}