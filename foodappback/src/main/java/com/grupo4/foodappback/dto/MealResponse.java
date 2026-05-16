package com.grupo4.foodappback.dto;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

// API TheMealDB
//============================================
//dto que recibe un JSON con la -- LISTA DE RECETAS -- y lo pasa a java

public class MealResponse {

    @JsonProperty("meals")
    private List<Meal> meals = new ArrayList<>();

    public List<Meal> getMeals() {
        return meals;
    }

    public void setMeals(List<Meal> meals) {
        this.meals = (meals != null) ? meals : new ArrayList<>();
    }
}

