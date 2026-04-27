package com.grupo4.foodappback.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

// API OpenFoodFacts
//============================================
//dto que recibe los datos de -- UN PRODUCTO --: codigo (barcode?), producto (nombre, marca, imagen, peso)
//recibe un JSON y lo convierte a Java con ayuda de @JsonProperty
//crea una CLASE INTERNA Product que luego se usará en los formularios de entrada de datos (VER EXPLICACIÓN ABAJO)

public class ProductResponse {

    @JsonProperty("code")
    private String code;

    @JsonProperty("product")
    private Product product;

    // getters y setters
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    // CLASE INTERNA:
    //===============
    public static class Product {
        @JsonProperty("product_name")
        private String productName;

        @JsonProperty("brands")
        private String brands;

        @JsonProperty("image_url")
        private String imageUrl;

        @JsonProperty("quantity")
        private String quantity; // peso del producto, ej: "100 g"

        // getters y setters
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public String getBrands() { return brands; }
        public void setBrands(String brands) { this.brands = brands; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

        public String getQuantity() { return quantity; }
        public void setQuantity(String quantity) { this.quantity = quantity; }
    }
}


/* ¿Por qué no usamos la entity Product ya existente? La clave es ésta:
    👉 No estás “creando otra entity Product”, estás creando un DTO diferente para un propósito distinto

🧠 1. Tienes dos “Product”, pero no son lo mismo
🟦 Tu Product (entity):
        Representa tu modelo de base de datos
        Suele llevar anotaciones tipo @Entity
        Tiene campos que tú decides (id, precio, usuario, etc.)
🟨 Este ProductResponse.Product (DTO)
        Representa cómo viene el JSON de una API externa (OpenFoodFacts)
        Solo tiene los campos que vienen en esa API
        No tiene nada que ver con tu base de datos

📦 2. ¿Por qué se crea otra clase? Porque el JSON que recibes tiene esta forma:
{
  "code": "123456",
  "product": {
    "product_name": "Chocolate",
    "brands": "Nestlé",
    "image_url": "...",
    "quantity": "100 g"
  }
}
👉 Fíjate: hay un objeto dentro de otro (product dentro de ProductResponse)

Por eso necesitas: 
private Product product;

Y esa clase interna:
public static class Product { ... }

⚠️ 3. ¿Por qué NO usar tu entity directamente? Porque sería mala práctica. Mezclarías cosas distintas:
❌ Problemas si usas tu entity:
La API externa puede cambiar
Tiene nombres distintos (product_name vs name)
Puede traer datos que no quieres guardar
Acoplas tu BD a una API externa 😬

🔄 4. Lo correcto: usar DTO → Entity. El flujo bueno es:

JSON (API externa)
   ↓
ProductResponse (DTO)
   ↓
Tu Product (Entity)
   ↓
Base de datos

5. ¿Por qué la clase es interna? Por organización:

ProductResponse.Product
👉 Solo existe dentro de esa respuesta
👉 No “contamina” tu modelo global

🧾 Resumen claro
✔️ No estás duplicando, estás separando responsabilidades
✔️ DTO = datos externos (API)
✔️ Entity = datos internos (BD)
✔️ Se transforman entre sí 
*/