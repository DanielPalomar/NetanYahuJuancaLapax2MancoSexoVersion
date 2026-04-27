package com.grupo4.foodappback.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.grupo4.foodappback.entities.Product;


public interface IProductRepository extends JpaRepository<Product, Long>{

    List<Product> findByUserId(Long id);

    Optional<Product> findByBarcode(String barcode);
    
}
