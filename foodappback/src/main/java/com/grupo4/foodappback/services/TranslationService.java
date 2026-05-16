package com.grupo4.foodappback.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.grupo4.foodappback.dto.TranslationResponse;

@Service
public class TranslationService {

    private final WebClient webClient;

    // Límite de caracteres de la API MyMemory por petición:
    private static final int LIMITE_API = 500;

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

        // 3. Si el texto supera el límite de la API, dividir en trozos y traducir cada uno:
        String result;
        if (text.length() > LIMITE_API) {
            result = translateLong(text, from, to);
        } else {
            result = callExternalApi(text, from, to);
        }

        cache.put(key, result);

        return result;
    }

    // ============================================
    // TRADUCCIÓN DE TEXTOS LARGOS (> 500 chars)
    // Divide por frases (". ") en trozos <= 500
    // ============================================
    private String translateLong(String text, String from, String to) {

        List<String> trozos = dividirEnTrozos(text, LIMITE_API);
        StringBuilder resultado = new StringBuilder();

        for (int i = 0; i < trozos.size(); i++) {
            String traducido = callExternalApi(trozos.get(i), from, to);
            resultado.append(traducido);
        }

        return resultado.toString();
    }

    // Divide un texto largo en trozos de máximo 'maxChars' caracteres,
    // intentando cortar por frases (". ") para no romper oraciones:
    private List<String> dividirEnTrozos(String text, int maxChars) {

        List<String> trozos = new ArrayList<>();
        String restante = text;

        while (restante.length() > maxChars) {
            // Buscar el último punto-espacio dentro del límite:
            int corte = restante.lastIndexOf(". ", maxChars);

            if (corte <= 0) {
                // Si no hay punto, buscar el último espacio:
                corte = restante.lastIndexOf(" ", maxChars);
            }
            if (corte <= 0) {
                // Si tampoco hay espacio, cortar en el límite exacto:
                corte = maxChars;
            } else {
                // Incluir el punto y el espacio en el trozo:
                corte = corte + 2;
            }

            trozos.add(restante.substring(0, corte));
            restante = restante.substring(corte);
        }

        // Añadir lo que quede:
        if (!restante.isEmpty()) {
            trozos.add(restante);
        }

        return trozos;
    }

    // ======================
    // API EXTERNA (controlada)
    // ======================
    private String callExternalApi(String text, String from, String to) {

        try {
            TranslationResponse response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/get") // Ruta get
                            .queryParam("q", text) // Texto a traducir
                            .queryParam("langpair", from + "|" + to) // Idioma al que traducir
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