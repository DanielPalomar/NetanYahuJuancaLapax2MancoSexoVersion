package com.grupo4.foodappback.services;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.grupo4.foodappback.dto.TranslationResponse;

@Service
public class TranslationService {

    private final WebClient webClient;

    public TranslationService(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("https://api.mymemory.translated.net")
                .build();
    }

    // ======================
    // CACHE (nivel básico pro)
    // ======================
    private final Map<String, String> cache = new ConcurrentHashMap<>();

    // ======================
    // DICCIONARIO LOCAL
    // ======================
    private final Map<String, String> dictionary = Map.of(
            "ternera", "beef",
            "pollo", "chicken",
            "cerdo", "pork",
            "arroz", "rice",
            "cebolla", "onion",
            "tomate", "tomato",
            "ajo", "garlic",
            "merluza", "hake"
    );

    // ======================
    // API PUBLICA
    // ======================
    public String toEnglish(String text) {
        return translate(text, "es", "en");
    }

    public String toSpanish(String text) {
        return translate(text, "en", "es");
    }

    // ======================
    // CORE TRANSLATION
    // ======================
    private String translate(String text, String from, String to) {

        if (text == null || text.isBlank()) {
            return text;
        }

        String normalized = text.trim().toLowerCase();
        String key = from + ":" + to + ":" + normalized;

        // 1. CACHE
        String cached = cache.get(key);
        if (cached != null) {
            return cached;
        }

        // 2. DICCIONARIO (evita API para palabras simples)
        if (from.equals("es") && to.equals("en")) {
            String dictValue = dictionary.get(normalized);
            if (dictValue != null) {
                cache.put(key, dictValue);
                return dictValue;
            }
        }

        // 3. API externa (solo si es necesario)
        String result = callExternalApi(text, from, to);

        cache.put(key, result);

        return result;
    }

    // ======================
    // API EXTERNA (controlada)
    // ======================
    private String callExternalApi(String text, String from, String to) {

        try {
            TranslationResponse response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/get")
                            .queryParam("q", text)
                            .queryParam("langpair", from + "|" + to)
                            .build())
                    .retrieve()
                    .bodyToMono(TranslationResponse.class)
                    .block();

            if (response == null ||
                response.getResponseData() == null ||
                response.getResponseData().getTranslatedText() == null) {
                return text; // fallback seguro
            }

            return response.getResponseData().getTranslatedText();

        } catch (Exception e) {
            // fallback anti-crash
            return text;
        }
    }
}