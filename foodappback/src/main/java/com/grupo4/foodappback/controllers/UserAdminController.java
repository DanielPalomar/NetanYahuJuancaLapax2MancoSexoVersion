package com.grupo4.foodappback.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

import com.grupo4.foodappback.entities.User;
import com.grupo4.foodappback.services.UserService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", allowedHeaders = "*")

// CONTROLLER EXCLUSIVO PARA ROL ADMIN:
// =====================================

@RestController
@RequestMapping("/api/users/admin")
public class UserAdminController {

    @Autowired
    private UserService userService;

    // Ver todos los users:
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Consultar un user existente y lo devuelve:
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }

    // Modificar o consultar un user existente y lo devuelve:
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> editUser(@Valid @PathVariable Long id,
            @RequestBody User user,
            BindingResult result) {
        if (result.hasErrors()) {
            return validation(result);
        }
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.editUser(user, id));
    }

    // Borrar un user y devolver la lista de users:
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public List<User> deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }

    // Activar un user:
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}")
    public User activateUser(@PathVariable Long id) {
        return userService.activateUser(id);
    }

    // Método común para manejar los errores al usar validaciones estándar en la
    // entity:
    private ResponseEntity<?> validation(BindingResult result) {
        Map<String, String> errors = new HashMap<>();
        result.getFieldErrors().forEach(err -> {
            errors.put(
                    err.getField(),
                    "El campo " + err.getField() + " " + err.getDefaultMessage());
        });
        return ResponseEntity.badRequest().body(errors);
    }
}
