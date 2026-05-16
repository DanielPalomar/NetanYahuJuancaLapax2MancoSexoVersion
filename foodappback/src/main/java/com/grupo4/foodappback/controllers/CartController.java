// CÓDIGO MUERTO - El frontend no usa ningún endpoint de carrito
// ===============================================================

/*
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

import com.grupo4.foodappback.entities.Cart;
import com.grupo4.foodappback.services.CartService;

import jakarta.validation.Valid;


//CONTROLLER PARA MANEJAR CARRITOS DEL USUARIO LOGUEADO
//=====================================================

@CrossOrigin(origins="http://localhost:5500", originPatterns = "*")   
@RestController
@RequestMapping("/api/cart")

public class CartController {
    
    @Autowired
    private CartService cartService;

    // crear un carrito:
    @PostMapping 
    public ResponseEntity<?> createCart(@Valid @RequestBody Cart cart, 
                        Authentication authentication,
                        BindingResult result) {
        if (result.hasErrors()){
            return validation(result);
        }
         return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(cartService.createCart(cart, authentication));
    }

    //ver los carritos del userLog:    
    @GetMapping
    public List<Cart> getUserCart(Authentication authentication) {       
        return cartService.getUserCarts(authentication);
    } 

    // filtrar los carritos del userLog por un barcode:
    @GetMapping("/barcode/{barcode}")
    public List<Cart> getUserCartByBarcode(Authentication authentication, @PathVariable String barcode) {
        return cartService.getUserCartByBarcode(authentication, barcode);
    }

    // filtrar los carritos del userLog por un nombre:
    @GetMapping("/name/{name}")
    public List<Cart> getUserCartByProductName(Authentication authentication, @PathVariable String name) {
        return cartService.getUserCartByProductName(authentication, name);
    }

    //ordenar los carritos por fecha de caducidad:
    @GetMapping ("/sort")
    public List<Cart> getUserCartByDate (Authentication authentication) {
        return cartService.getUserCartByDate(authentication);
    }

    //borrar un carrito a partir de su ID (mostrando solo los carritos del userLog):
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteUserCart(@PathVariable Long id) {        
        cartService.deleteUserCart(id);
        return ResponseEntity
        .status(HttpStatus.OK)
        .body("Carrito eliminado por el usuario");
    }

    //modificar un carrito de los mostrados:
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCart(@Valid @RequestBody Cart cart,  @PathVariable Long id, Authentication authentication,                                
                                 BindingResult result) {
        if (result.hasErrors()){
            return validation(result);
        }        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(cartService.updateCart(cart, id, authentication));        
    }


    // Método común para manejar los errores al usar validaciones directamente en la entity:
    private ResponseEntity<?> validation (BindingResult result) {
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
*/
