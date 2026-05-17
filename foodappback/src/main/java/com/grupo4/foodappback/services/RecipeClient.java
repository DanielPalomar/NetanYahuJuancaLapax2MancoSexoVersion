package com.grupo4.foodappback.services;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.grupo4.foodappback.dto.MealResponse;

@Service
public class RecipeClient {
        private final WebClient webClient;

        public RecipeClient(WebClient.Builder builder) {
                this.webClient = builder
                                .baseUrl("https://www.themealdb.com/api/json/v1/1")
                                .build();
        }

        public MealResponse byIngredient(String ingredient) {
                return webClient.get()
                                .uri(uri -> uri.path("/filter.php")
                                                .queryParam("i", ingredient)
                                                .build())
                                .retrieve()
                                .bodyToMono(MealResponse.class)
                                .block();
        }

        public MealResponse byId(String id) {
                return webClient.get()
                                .uri(uri -> uri.path("/lookup.php")
                                                .queryParam("i", id)
                                                .build())
                                .retrieve()
                                .bodyToMono(MealResponse.class)
                                .block();
        }

}
