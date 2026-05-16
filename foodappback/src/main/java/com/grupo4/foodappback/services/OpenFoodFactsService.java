package com.grupo4.foodappback.services;

import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.stereotype.Service;

import com.grupo4.foodappback.dto.ProductResponse;

@Service
public class OpenFoodFactsService {

    /* instanciamos WebClient, q es una clase de Spring WebFlux que se usa para hacer peticiones HTTP (GET, POST,...) 
    desde el backend. Lo usamos para llamar a la API de OpenFoodFacts */
    private final WebClient webClient;

    public OpenFoodFactsService(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("https://world.openfoodfacts.org/api/v0/product")
                .build();
    }

    /** Método que busca un producto por su código de barras en OpenFoodFacts:
     * @param barcode: Código de barras
     * @return ProductResponse: DTO con los datos del producto, o null si no existe
     */
    public ProductResponse getProductByBarcode(String barcode) {
    try {
        if (barcode == null || barcode.isBlank()) {
            return null;
        }



        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/{barcode}.json")
                        .build(barcode))
                .retrieve()
                .bodyToMono(ProductResponse.class)
                .block();

    } catch (Exception e) {
        e.printStackTrace();
        return null;
    }
}
}