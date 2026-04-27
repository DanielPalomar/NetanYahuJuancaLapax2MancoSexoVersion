package com.grupo4.foodappback.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.grupo4.foodappback.entities.User;
import com.grupo4.foodappback.services.UserService;

import jakarta.validation.Valid;

/**
 * CONTROLADOR DE USUARIOS
 * Centraliza la gestión de usuarios tanto para usuarios normales como para administradores.
 */
@CrossOrigin(origins="*", originPatterns = "*")
@RestController
@RequestMapping("/api/usuarios")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    // --- ENDPOINTS PÚBLICOS ---

    @PostMapping("/registrar")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user, 
                                        BindingResult result){      
        if (result.hasErrors()){
            return validation(result);
        }
        user.setAdmin(false);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.registerUser(user));
    }     
    
    // --- ENDPOINTS PARA USUARIO AUTENTICADO ---

    @PutMapping
    public ResponseEntity<?> editLogUser (@Valid @RequestBody User user, 
                                        Authentication authentication,
                                        BindingResult result) {       
        if (result.hasErrors()){
            return validation(result);
        }        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.editLogUser(authentication, user));    
    }

    // --- ENDPOINTS PARA ADMINISTRADORES ---

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }    

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> editUser(@PathVariable Long id, 
                                    @Valid @RequestBody User user, 
                                    BindingResult result) {       
        if (result.hasErrors()){
            return validation(result);
        }        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.editUser(user, id));    
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public List<User> deleteUser (@PathVariable Long id) {
        return userService.deleteUser(id); 
    }   
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/activar/{id}")
    public User activateUser(@PathVariable Long id) {     
        return userService.activateUser(id);
    }

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
