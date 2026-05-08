package com.grupo4.foodappback.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.grupo4.foodappback.entities.Product;
import com.grupo4.foodappback.entities.User;
import com.grupo4.foodappback.exceptions.BusinessException;
import com.grupo4.foodappback.exceptions.UserNotFoundException;
import com.grupo4.foodappback.repositories.IProductRepository;
import com.grupo4.foodappback.repositories.IUserRepository;

// MANEJO DE LA BD DE PRODUCTOS
//=============================

@Service
public class ProductService {
    
    @Autowired
    private IProductRepository productRepository;

    @Autowired
    private IUserRepository userRepository; 




    // Buscar un producto en la BD a partir de su ID: sin authentication pq no lo necesitamos en el cuerpo:
    public Product findById (Long id) {        
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    // Obtener el nombre del user autenticado en cada endpoint:
    private User getAuthenticatedUser (Authentication authentication) {
        String username = authentication.getName(); // el Name de un authenticarion es el username/email
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    
    // Guardar un producto (junto con el user logueado obtenido en el método anterior) en la BD:
    public Product createProduct(Product product, Authentication authentication) {
        String username = authentication.getName();
        User u = userRepository.findByUsername(username).orElseThrow(() 
                            -> new UserNotFoundException("Usuario no encontrado"));   
        product.setUser(u); 
        return productRepository.save(product);
    }

    // ENDPOINTS SOLO PARA USERLOG PROPIETARIO O ADMIN:
    //================================================

    // Actualizar un producto de la BD: solo puede actualizar su propietario o un admin: --- SOLO CAMBIAR NOMBRE, MARCA, PESO ---
    public Product updateProduct(Long productId, Product p, Authentication authentication) {
        User userLog = getAuthenticatedUser(authentication);
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Lanza excepcion si no es el propietario del producto o un admin:
        if (!product.getUser().getId().equals(userLog.getId())
                && userLog.getRoles().stream().noneMatch(r -> r.getName().equals("ROLE_ADMIN"))) {
            throw new BusinessException("No tiene permisos para actualizar");
        }
        product.setName(p.getName());  
        product.setBrand(p.getBrand());  
        product.setCantidad(p.getCantidad());  
        product.setExpirationDate(p.getExpirationDate());

       return productRepository.save(product);
    }

    // Borrar un producto de la BD a partir de su ID: solo puede borrar su propietario o un admin:
    public void deleteProduct(Long id, Authentication authentication) {
        User userLog = getAuthenticatedUser (authentication);
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (!product.getUser().getId().equals(userLog.getId())
                && userLog.getRoles().stream().noneMatch(r -> r.getName().equals("ROLE_ADMIN"))) {
            throw new BusinessException("No tiene permisos de borrado");
        }
        productRepository.delete(product);
    }
    
    // Listar todos los productos solo si userLog es ADMIN:
    //====================================================

    // Listar todos los productos del usuario logueado:
    public List<Product> getProducts(Authentication authentication) {
        User userLog = getAuthenticatedUser(authentication);
        return productRepository.findByUserId(userLog.getId());
    }
}

