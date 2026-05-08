package com.grupo4.foodappback.services;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.ArrayList;

/**
 * SERVICIO DE TRADUCCIÓN
 * Utiliza la API gratuita de Google Translate para localizar contenidos.
 */
@Service
public class TranslationService {

    private final WebClient webClient;

    public TranslationService(WebClient.Builder builder) {
        this.webClient = builder.build();
    }

    /**
     * Traduce un texto de un idioma a otro.
     */
    @SuppressWarnings("unchecked")
    public String translate(String text, String sourceLang, String targetLang) {
        if (text == null || text.trim().isEmpty()) return text;

        try {
            // Construimos la URL de forma segura para evitar problemas con caracteres especiales
            String url = UriComponentsBuilder.fromUriString("https://translate.googleapis.com/translate_a/single")
                    .queryParam("client", "gtx")
                    .queryParam("sl", sourceLang)
                    .queryParam("tl", targetLang)
                    .queryParam("dt", "t")
                    .queryParam("q", text)
                    .build()
                    .toUriString();

            List<Object> root = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(List.class)
                    .block();

            if (root != null && !root.isEmpty() && root.get(0) instanceof List) {
                List<List<Object>> sentences = (List<List<Object>>) root.get(0);
                StringBuilder result = new StringBuilder();
                for (List<Object> sentence : sentences) {
                    if (sentence != null && !sentence.isEmpty()) {
                        result.append(sentence.get(0).toString());
                    }
                }
                return result.toString();
            }
        } catch (Exception e) {
            System.err.println("❌ Error en traducción: " + e.getMessage());
        }
        return text; // Si falla, devolvemos el original
    }

    /**
     * Traduce una lista de textos de forma eficiente.
     */
    public List<String> translateList(List<String> texts, String sourceLang, String targetLang) {
        if (texts == null || texts.isEmpty()) return texts;
        
        // Unimos con un delimitador único que no suela aparecer en los ingredientes
        String combined = String.join(" ||| ", texts);
        String translated = translate(combined, sourceLang, targetLang);
        
        String[] split = translated.split(" \\|\\|\\| ");
        List<String> result = new ArrayList<>();
        for (String s : split) {
            result.add(s.trim());
        }
        return result;
    }
}
