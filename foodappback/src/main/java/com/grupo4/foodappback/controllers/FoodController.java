package com.grupo4.foodappback.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.grupo4.foodappback.entities.Product;
import com.grupo4.foodappback.services.ProductService;

//CONTROLLER PARA TODOS LOS ROLES: BUSCA UN PRODUCTO A PARTIR DE SU BARCODE, TANTO EN API COMO EN BD, Y NO LO GUARDA
//==================================================================================================================

@CrossOrigin(origins="http://localhost:5500")
@RestController
@RequestMapping("/api/food")
public class FoodController {

    @Autowired
    private ProductService productService;

    // Busca un producto por su código de barras -> si no existe en la DB, lo obtiene de OpenFoodFacts y LO MUESTRA:
    @GetMapping("/{barcode}")
    public ResponseEntity<Product> getProductByBarcode(@PathVariable String barcode) {
        return ResponseEntity.ok(productService.getProductByBarcode(barcode));
    }

}
