package com.grupo4.foodappback.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.grupo4.foodappback.validations.IsRequired;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="roles")
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @IsRequired
    @Column(unique = true)
    private String name;

    /* RELACIÓN MANY TO MANY CON USUARIO: mappedBy indica que la tabla intermedia la gestiona User
     * @JsonIgnoreProperties evita referencias circulares al serializar JSON     */
    @JsonIgnoreProperties({"roles", "handler", "hibernateLazyInitializer"})
    @ManyToMany(mappedBy = "roles")
    private List<User> users;

    //Constructor por defecto: Inicializa la lista de usuarios
    public Role() {
        this.users = new ArrayList<>();
    }
    // Constructor con nombre:
    public Role(String name) {
        this.name = name;
    }

    /* ==========================
       GETTERS & SETTERS
       ========================== */
    public Long getId() {        return id;    }
    public void setId(Long id) {        this.id = id;    }

    public String getName() {        return name;    }
    public void setName(String name) {        this.name = name;    }

    public List<User> getUsers() {        return users;    }
    public void setUsers(List<User> users) {        this.users = users;    }

    /* ==========================
       equals & hashCode
       ==========================
       Importantes para relaciones Many-to-Many
       Evitan duplicados en colecciones
    */
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((name == null) ? 0 : name.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Role other = (Role) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        if (name == null) {
            if (other.name != null)
                return false;
        } else if (!name.equals(other.name))
            return false;
        return true;
    }
}


