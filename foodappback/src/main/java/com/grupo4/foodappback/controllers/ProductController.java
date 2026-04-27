package com.grupo4.foodappback.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grupo4.foodappback.entities.Product;
import com.grupo4.foodappback.services.ProductService;

import jakarta.validation.Valid;


//CONTROLLER PARA TODOS LOS ROLES: MANEJA LOS PRODUCTOS DEL USER LOGUEADO, SOLO EN LA -- BD -- Y A PARTIR DE SU ID
//===================================================================================================================

@CrossOrigin(origins="*", originPatterns = "*")   
@RestController
@RequestMapping("/api/productos")
public class ProductController {
    
    @Autowired
    private ProductService productService;   
    
    //ver los productos de la BD que ha guardo alguna vez el userLog:
    @GetMapping
    public List<Product> getProducts(Authentication authentication) {
        return productService.getProducts(authentication);    
    }
    
    // Guardar producto en la BD:
    @PostMapping
    public ResponseEntity<?> createProduct(@Valid @RequestBody Product product,
                                            Authentication authentication,
                                            BindingResult result) {
        if (result.hasErrors()){
            return validation(result);
        }        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(productService.createProduct(product, authentication));
    }

    // Obtener CUALQUIER producto a partir de su ID -> para obtener a partir de su barcode usamos FOODCONTROLLER:    
    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return productService.findById(id);     //este método no necesita saber quien es userLog, así q no usa authentication
    }
    
    // modificar producto de la BD a partir de su id: USER solo los suyos, y ADMIN todos:
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id,
                                 @Valid @RequestBody Product product,
                                 Authentication authentication,
                                 BindingResult result) {
        if (result.hasErrors()){
            return validation(result);
        }        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(productService.updateProduct(id, product, authentication));        
    }
    
    //borrar producto a partir de su id: USER solo los suyos, y ADMIN todos: 
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id,Authentication authentication) {
        productService.deleteProduct(id, authentication);
    }


    // Método común para manejar los errores al usar validaciones directamente en la entity:
    private ResponseEntity<?> validation(BindingResult result) {
        Map<String, String> errors = new HashMap<>();
        result.getFieldErrors().forEach(err -> {
            errors.put(
                err.getField(),
                "El campo " + err.getField() + " " + err.getDefaultMessage()
            );
        });
        return ResponseEntity.badRequest().body(errors);
    }
  
}
    