package com.grupo4.foodappback.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.grupo4.foodappback.validations.IsRequired;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

@Entity
// Sin restricción UNIQUE en barcode: el mismo producto puede existir varias veces con distintas fechas
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ya no es unique por sí solo: se permite repetir barcode si la fecha de caducidad es distinta
    private String barcode;

    @IsRequired
    // Aumentamos el tamaño máximo a 100 para permitir nombres de productos más largos y descriptivos sin lanzar errores de validación
    @Size(max = 100, message = "{Size.product.name}")
    private String name;

    // Aumentamos el tamaño máximo a 100 para permitir marcas más largas sin lanzar errores de validación
    @Size(max = 100, message = "{Size.product.brand}")
    private String brand;

    private Integer cantidad;

    private LocalDate fechaCaducidad;

    // (código muerto)
    // private float weight;
    // private String url_image;

    // relacion con la tabla cart (código muerto)
    // @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval =
    // true)
    // @JsonManagedReference("cart-product")
    // private List<Cart> carts = new ArrayList<>();

    // relacion con la tabla users:
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference("user-product")
    private User user;

    // =========================
    // Constructor
    // =========================
    public Product() {
    }

    // =========================
    // Getters y Setters
    // =========================
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public LocalDate getFechaCaducidad() {
        return fechaCaducidad;
    }

    public void setFechaCaducidad(LocalDate fechaCaducidad) {
        this.fechaCaducidad = fechaCaducidad;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // (código muerto de Cart)
    // public List<Cart> getCarts() { return carts; }
    // public void setCarts(List<Cart> carts) { this.carts = carts; }

    // public float getWeight() { return weight; }
    // public void setWeight(float weight) { this.weight = weight; }

    // public String getUrl_image() { return url_image; }
    // public void setUrl_image(String url_image) { this.url_image = url_image; }

}
