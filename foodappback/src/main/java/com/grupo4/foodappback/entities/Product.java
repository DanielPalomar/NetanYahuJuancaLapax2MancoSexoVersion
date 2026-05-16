package com.grupo4.foodappback.entities;

// CAMBIO: se eliminaron imports de ArrayList, List, JsonManagedReference, CascadeType, OneToMany
// (eran para la relación con Cart, ya comentada como código muerto)

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

import java.time.LocalDate;

@Entity
@Table(name="products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String barcode;  
    
    @IsRequired
    @Size(max = 20, message = "{Size.product.name}")
    private String name;    
    
    @Size(max = 20, message = "{Size.product.brand}")
    private String brand;   

    // CAMBIO: nuevos campos (antes estaban en Cart como stock y expiration_date)
    private Integer cantidad;

    private LocalDate fechaCaducidad;

    // CAMBIO: campos eliminados de la BD (código muerto)
    // private float weight;
    // private String url_image;
  
    //relacion con la tabla cart (COMENTADO - código muerto)
    // @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    // @JsonManagedReference("cart-product")
    // private List<Cart> carts = new ArrayList<>();
    
     //relacion con la tabla users:
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

    // CAMBIO: nuevos getters/setters para cantidad y fechaCaducidad
    public Integer getCantidad() {        return cantidad;    }
    public void setCantidad(Integer cantidad) {        this.cantidad = cantidad;    }

    public LocalDate getFechaCaducidad() {        return fechaCaducidad;    }
    public void setFechaCaducidad(LocalDate fechaCaducidad) {        this.fechaCaducidad = fechaCaducidad;    }

     public User getUser() {        return user;    }
    public void setUser(User user) {        this.user = user;    }

    // (COMENTADO - código muerto de Cart)
    // public List<Cart> getCarts() {        return carts;    }
    // public void setCarts(List<Cart> carts) {        this.carts = carts;    }

    // (COMENTADO - campos eliminados de la BD)
    // public float getWeight() {        return weight;    }
    // public void setWeight(float weight) {        this.weight = weight;    }

    // public String getUrl_image() {        return url_image;    }
    // public void setUrl_image(String url_image) {        this.url_image = url_image;    }   

}
