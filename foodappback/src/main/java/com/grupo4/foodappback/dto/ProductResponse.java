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
  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public Product getProduct() {
    return product;
  }

  public void setProduct(Product product) {
    this.product = product;
  }

  // CLASE INTERNA:
  // ===============
  public static class Product {
    @JsonProperty("product_name")
    private String productName;

    @JsonProperty("brands")
    private String brands;

    // campos eliminados de la BD
    // @JsonProperty("image_url")
    // private String imageUrl;

    // @JsonProperty("quantity")
    // private String quantity; // peso del producto, ej: "100 g"

    // getters y setters
    public String getProductName() {
      return productName;
    }

    public void setProductName(String productName) {
      this.productName = productName;
    }

    public String getBrands() {
      return brands;
    }

    public void setBrands(String brands) {
      this.brands = brands;
    }

    // getters/setters de campos eliminados
    // public String getImageUrl() { return imageUrl; }
    // public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    // public String getQuantity() { return quantity; }
    // public void setQuantity(String quantity) { this.quantity = quantity; }
  }
}
