// CÓDIGO MUERTO - El frontend no usa ningún endpoint de carrito admin
// ====================================================================

/*
package com.grupo4.foodappback.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grupo4.foodappback.entities.Cart;
import com.grupo4.foodappback.services.CartService;

//CONTROLLER PARA MANEJAR CARRITOS POR EL ADMIN
//=============================================

@CrossOrigin(origins="http://localhost:5500", originPatterns = "*")   
@RestController
@RequestMapping("/api/cart")
public class CartAdminController {

    @Autowired
    private CartService cartService;

// ENDPOINTS solo para rol ADMIN:
//==============================

    //ver el contenido de la tabla carts:
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public List<Cart> findAllCarts() {
        return cartService.findAll();
    }

    //mostrar los carritos de un user a partir de su username:
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/{username}")
    public List<Cart> findByUsername(@PathVariable String username) {
        return cartService.listAllCarts(username);
    }

    //borrar todos los carritos de un user a partir de su username:
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/{username}")
    public ResponseEntity<Object> deleteUserCartAdmin(@PathVariable String username){    
        cartService.deleteUserCartAdmin(username);
        return ResponseEntity.status(HttpStatus.OK).body("Carrito/s eliminado/s por el administrador.");
    }

    //borrar un carrito dado de un usuario dado:
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/{username}/{idCarrito}")
    public ResponseEntity<Object> deleteUserCartAdminByOne(@PathVariable String username, @PathVariable Long idCarrito){
        cartService.deleteUserCartAdminByOne(username, idCarrito);
        return ResponseEntity.status(HttpStatus.OK).body("Carrito/s eliminado/s por el administrador.");
    }    
    
}
*/
