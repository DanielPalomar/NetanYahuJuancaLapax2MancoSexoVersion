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
    // CACHE (nivel bÃ¡sico pro)
    // ======================
    private final Map<String, String> cache = new ConcurrentHashMap<>();

    // ======================
    // DICCIONARIOS LOCALES (Bilingüe)
    // ======================
    private final Map<String, String> dictionaryEsEn = Map.ofEntries(
            Map.entry("ternera", "beef"),
            Map.entry("pollo", "chicken"),
            Map.entry("cerdo", "pork"),
            Map.entry("arroz", "rice"),
            Map.entry("cebolla", "onion"),
            Map.entry("tomate", "tomato"),
            Map.entry("ajo", "garlic"),
            Map.entry("merluza", "hake"),
            Map.entry("huevo", "egg"),
            Map.entry("leche", "milk"),
            Map.entry("queso", "cheese"),
            Map.entry("mantequilla", "butter"),
            Map.entry("harina", "flour"),
            Map.entry("patata", "potato"),
            Map.entry("pan", "bread"),
            Map.entry("aceite", "oil"),
            Map.entry("limon", "lemon"),
            Map.entry("zanahoria", "carrot"),
            Map.entry("manzana", "apple"),
            Map.entry("platano", "banana"),
            Map.entry("naranja", "orange"),
            Map.entry("azucar", "sugar"),
            Map.entry("sal", "salt"),
            Map.entry("pimienta", "pepper"),
            Map.entry("espinaca", "spinach"),
            Map.entry("agua", "water")
    );

    private final Map<String, String> dictionaryEnEs = Map.ofEntries(
            Map.entry("chicken", "pollo"),
            Map.entry("beef", "ternera"),
            Map.entry("pork", "cerdo"),
            Map.entry("rice", "arroz"),
            Map.entry("onion", "cebolla"),
            Map.entry("tomato", "tomate"),
            Map.entry("garlic", "ajo"),
            Map.entry("hake", "merluza"),
            Map.entry("egg", "huevo"),
            Map.entry("eggs", "huevos"),
            Map.entry("milk", "leche"),
            Map.entry("cheese", "queso"),
            Map.entry("butter", "mantequilla"),
            Map.entry("flour", "harina"),
            Map.entry("potato", "patata"),
            Map.entry("potatoes", "patatas"),
            Map.entry("bread", "pan"),
            Map.entry("oil", "aceite"),
            Map.entry("olive oil", "aceite de oliva"),
            Map.entry("lemon", "limón"),
            Map.entry("carrot", "zanahoria"),
            Map.entry("carrots", "zanahorias"),
            Map.entry("apple", "manzana"),
            Map.entry("banana", "plátano"),
            Map.entry("orange", "naranja"),
            Map.entry("sugar", "azúcar"),
            Map.entry("salt", "sal"),
            Map.entry("pepper", "pimienta"),
            Map.entry("spinach", "espinaca"),
            Map.entry("water", "agua"),
            Map.entry("yeast", "levadura"),
            Map.entry("parsley", "perejil"),
            Map.entry("cinnamon", "canela"),
            Map.entry("vanilla", "vainilla"),
            Map.entry("honey", "miel"),
            Map.entry("ginger", "jengibre"),
            Map.entry("mustard", "mostaza"),
            Map.entry("vinegar", "vinagre")
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
        System.out.println("Texto que se va a traducir: " + text);
        System.out.println("La longitud del texto al llegar a translate: " + text.length());

        // cambio para que no salte error en el front
        if (text.length() > 490) {
            // se busca el ultimo espacio
            int corte = text.lastIndexOf(" ", 490);
            if (corte == -1)
                corte = 490; // por si no hay espacios

            // Traduce las dosm itades
            return translate(text.substring(0, corte), from, to) + " " +
                    translate(text.substring(corte).trim(), from, to);
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
            String dictValue = dictionaryEsEn.get(normalized);
            if (dictValue != null) {
                cache.put(key, dictValue);
                return dictValue;
            }
        } else if (from.equals("en") && to.equals("es")) {
            String dictValue = dictionaryEnEs.get(normalized);
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