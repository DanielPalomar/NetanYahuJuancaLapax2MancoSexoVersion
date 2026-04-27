package com.grupo4.foodappback.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.grupo4.foodappback.validations.IsRequired;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;

/**
 * ENTIDAD: PRODUCTO
 * Representa un alimento guardado en la despensa de un usuario.
 */
@Entity
@Table(name="products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * CÓDIGO DE BARRAS
     * Nota: Hemos quitado la restricción de 'unique' en la base de datos.
     * El frontend envía 'null' cuando no hay código para permitir múltiples productos sin EAN.
     */
    @Column
    private String barcode;  
    
    /**
     * NOMBRE DEL PRODUCTO
     * Hemos subido el límite a 255 caracteres para evitar errores con productos de OpenFoodFacts.
     */
    @IsRequired
    @Size(max = 255, message = "{Size.product.name}")
    private String name;    
    
    @Size(max = 255, message = "{Size.product.brand}")
    private String brand;   

    private float weight;

    private String url_image;

    /**
     * FECHA DE CADUCIDAD
     * Usamos JsonFormat para que el servidor entienda el formato de fecha ISO (yyyy-MM-dd) que envía React.
     */
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd")
    private java.time.LocalDate expirationDate;
  
    
    // Relación con el Usuario (Dueño de la despensa)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference("user-product")
    private User user;
    
   
    // =========================
    // Constructor
    // =========================
    public Product() {}

    // =========================
    // Getters y Setters
    // ========================= 
    public Long getId() {        return id;    }
    public void setId(Long id) {        this.id = id;    }

    public String getBarcode() {        return barcode;    }
    public void setBarcode(String barcode) {        this.barcode = barcode;    }

    public String getName() {        return name;    }
    public void setName(String name) {        this.name = name;    }

    public String getBrand() {        return brand;    }
    public void setBrand(String brand) {        this.brand = brand;    }

    public String getUrl_image() {        return url_image;    }
    public void setUrl_image(String url_image) {        this.url_image = url_image;    }   

     public User getUser() {        return user;    }
    public void setUser(User user) {        this.user = user;    }


    public float getWeight() {        return weight;    }
    public void setWeight(float weight) {        this.weight = weight;    }

    public java.time.LocalDate getExpirationDate() { return expirationDate; }
    public void setExpirationDate(java.time.LocalDate expirationDate) { this.expirationDate = expirationDate; }

}
