// CÓDIGO MUERTO - Entidad Cart no usada por el frontend
// =======================================================

/*
package com.grupo4.foodappback.entities;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "carts")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  
   
    @NotNull
    @Positive(message = "{Positive.cart.stock}")
    private Integer stock;

    @NotNull
    @Future(message = "{Future.cart.expiration_date}")
    private LocalDate expiration_date;

    //===============
    //  RELACIONES
    //===============

    //relacion con la tabla Productos:    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonBackReference("cart-product")
    private Product product;

    //relacion con la tabla Usuarios:
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference("user-cart")
    private User user;
   

    // =========================
    // Constructor
    // =========================
    public Cart() {}

    // =========================
    // Getters y Setters
    // =========================    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Integer getStock() {
        return stock;
    }
    public void setStock(Integer stock) {
        this.stock = stock;
    }
    public Product getProduct() {
        return product;
    }
    public void setProduct(Product product) {
        this.product = product;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public LocalDate getExpiration_date() {
        return expiration_date;
    }
    public void setExpiration_date(LocalDate expiration_date) {
        this.expiration_date = expiration_date;
    }    

}
*/
