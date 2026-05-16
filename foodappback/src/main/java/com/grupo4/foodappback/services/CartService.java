// CÓDIGO MUERTO - Service de Cart no usado por el frontend
// ==========================================================

/*
package com.grupo4.foodappback.services;

import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.grupo4.foodappback.entities.Cart;
import com.grupo4.foodappback.entities.User;
import com.grupo4.foodappback.exceptions.BusinessException;
import com.grupo4.foodappback.exceptions.UserNotFoundException;
import com.grupo4.foodappback.repositories.ICartRepository;
import com.grupo4.foodappback.repositories.IProductRepository;
import com.grupo4.foodappback.repositories.IUserRepository;


@Service
public class CartService {

    @Autowired
    ICartRepository cartRepository;

    @Autowired
    IUserRepository userRepository;  

    @Autowired
    IProductRepository productRepository;
  
    // Crear un carrito de logUser:
    public Cart createCart (Cart c, Authentication authentication) {
        String username = authentication.getName();
        User u = userRepository.findByUsername(username).orElseThrow(() 
                            -> new UserNotFoundException("Usuario no encontrado"));              
        c.setUser(u);        
        return cartRepository.save(c);
    }    
    
    // Mostrar los carritos de un logUser:
    public List<Cart> getUserCarts(Authentication authentication){
        String username = authentication.getName();
        return cartRepository.findByUserUsername(username);
    }

    // Mostrar los carritos del logUser filtrados por barcode:
     public List<Cart> getUserCartByBarcode (Authentication authentication, String barcode){
        String username = authentication.getName();
        List<Cart> allCarts = cartRepository.findByUserUsername(username);

        return allCarts.stream()
            .filter(cart -> barcode.equals(cart.getProduct().getBarcode()))
            .toList();
    }

    // Mostrar los carritos del logUser filtrados por nombre del producto:
    public List<Cart> getUserCartByProductName(Authentication authentication, String name) {
        String username = authentication.getName();
        List<Cart> allCarts = cartRepository.findByUserUsername(username);

        return allCarts.stream()
            .filter(cart -> cart.getProduct().getName()
            .toLowerCase()
            .contains(name.toLowerCase()))        
            .toList();
    }

    // Mostrar los carritos del logUser ordenados por fecha de caducidad:
    public List<Cart> getUserCartByDate(Authentication authentication) {
        String username = authentication.getName();

        List<Cart> allCarts = cartRepository.findByUserUsername(username);

        return allCarts.stream()
                .sorted(Comparator.comparing(Cart::getExpiration_date))
                .toList();
    }

    // Borrar un carrito a partir de su id:
    public void deleteUserCart(Long id){
        cartRepository.deleteById(id);
    }

    // Modificar el stock de un carrito:
    public Cart updateCart(Cart c, Long id, Authentication authentication) {

        String username = authentication.getName();

        Cart modifyCart = cartRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));

        if (!modifyCart.getUser().getUsername().equals(username)) {
            throw new RuntimeException("No tienes permisos");
        }

        modifyCart.setStock(c.getStock());
        modifyCart.setExpiration_date(c.getExpiration_date());

        return cartRepository.save(modifyCart);
    }


    // ENDPOINTS SOLO PARA ADMIN:
    //================================================

    // Mostrar todos los carritos de un user a partir de su id:
    public List<Cart> listAllCarts (String username) {
        return cartRepository.findByUserUsername(username);
    }
    
    // Borrar todos los carritos de un user a partir de su username:
    public void deleteUserCartAdmin(String username){        
        List<Cart> cartDelete = cartRepository.findByUserUsername(username);
        cartRepository.deleteAll(cartDelete); 
    }

    // Mostrar todos los carritos de la tabla:
    public List<Cart> findAll(){
        return cartRepository.findAll();
    }    

    // Borrar un carrito por su id de entre los de un usuario dado por su username:
    public void deleteUserCartAdminByOne(String username, Long idCart){       
        List<Cart> cartDelete = cartRepository.findByUserUsername(username);

        for (Cart c : cartDelete) {
            if (c.getId().equals(idCart)){
                cartRepository.delete(c);
            } else {
                throw new BusinessException("No se encontró el carrito en la lista del usuario");
            }
        } 

    }
}
*/
