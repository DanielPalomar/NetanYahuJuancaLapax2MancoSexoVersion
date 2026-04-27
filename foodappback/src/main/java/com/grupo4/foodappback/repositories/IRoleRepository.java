package com.grupo4.foodappback.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.grupo4.foodappback.entities.Role;


public interface IRoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(String string);
    
}
