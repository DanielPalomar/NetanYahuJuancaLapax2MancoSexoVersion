package com.grupo4.foodappback.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.grupo4.foodappback.validations.IsRequired;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @IsRequired
    @Size(max = 20, message = "{Size.user.name}")
    private String name;  
   
    @IsRequired
    @Size(max = 20, message = "{Size.user.lastname}")
    private String lastname;
    
    @IsRequired                
    @Size(max = 12, message = "{Size.user.username}")   
    @Column(unique = true)
    private String username;
    
    @IsRequired
    @Email(message = "{Email.user.email}")
    @Column(unique = true)
    private String email;  
    
    @IsRequired
    @Size(min=4, message="{Size.user.password}")
    private String password;

    //===============
    //  RELACIONES
    //===============

    //relacion con la entidad Product:
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("user-product")
    private List<Product> products = new ArrayList<>();

    /* relación con la entidad Role -> tabla intermedia: users_roles 
     * @JsonIgnoreProperties evita bucles infinitos al serializar JSON    */
    @JsonIgnoreProperties({"users", "handler", "hibernateLazyInitializer"})
    @ManyToMany
    @JoinTable(
        name = "users_roles",
        joinColumns = @JoinColumn(name="user_id"),
        inverseJoinColumns = @JoinColumn(name="role_id"),
        uniqueConstraints = {
            @UniqueConstraint(columnNames = {"user_id", "role_id"})
        }
    )

    private List<Role> roles;
    
    // Constructor por defecto: Inicializa la lista de roles
    public User() {
        roles = new ArrayList<>();
    }

    // Variable q indica si el usuario está activado: 
    private boolean enabled;

    // Se ejecuta antes de guardar el usuario por primera vez -> activa el usuario automáticamente
    @PrePersist
    public void prePersist() {
        enabled = true;    
    }

    /**
     * Indica si el usuario es administrador:
     * - NO se guarda en base de datos (@Transient), solo se usa durante el registro
     * - No se devuelve en respuestas JSON
     */
    @Transient
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private boolean admin;
   

    // =========================
    // Getters y Setters
    // =========================  
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    } 
    public List<Role> getRoles() {
        return roles;
    }
    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }
    public String getLastname() {
        return lastname;
    }
    public void setLastname(String lastname) {
        this.lastname = lastname;
    }
 
    public boolean isEnabled() {
        return enabled;
    }
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
    public boolean isAdmin() {
        return admin;
    }
    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public List<Product> getProducts() {
        return products;
    }
    public void setProducts(List<Product> products) {
        this.products = products;
    }   

}
