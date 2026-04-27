package com.grupo4.foodappback.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

// API Google Translator
//============================================
//dto que recibe la traducción de una RECETA. Usa una CLASE INTERNA que pasa la response a un String.

public class TranslationResponse {

    @JsonProperty("responseData")
    private ResponseData responseData;

    // getters y setters
    public ResponseData getResponseData() { return responseData; }
    public void setResponseData(ResponseData responseData) { this.responseData = responseData; }

    // Clase interna que representa como String la response obtenida:
    public static class ResponseData {

        @JsonProperty("translatedText")
        private String translatedText;

        // getters y setters
        public String getTranslatedText() { return translatedText; }
        public void setTranslatedText(String translatedText) { this.translatedText = translatedText; }
    }
}