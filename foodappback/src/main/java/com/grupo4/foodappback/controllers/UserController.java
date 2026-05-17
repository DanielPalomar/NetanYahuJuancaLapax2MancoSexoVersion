package com.grupo4.foodappback.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grupo4.foodappback.entities.User;
import com.grupo4.foodappback.services.UserService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:5500", originPatterns = "*")

// CONTROLLER PARA TODOS LOS ROLES: guardar y modificar users en la BD
// ======================================================================

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // registrar un nuevo usuario q por defecto va a tener ROLE_USER y lo devuelve:
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user,
            BindingResult result) {
        if (result.hasErrors()) {
            return validation(result);
        }

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.registerUser(user));
    }

    // Modifica el userLog y lo devuelve
    @PutMapping
    public ResponseEntity<?> editLogUser(@Valid @RequestBody User user,
            Authentication authentication,
            BindingResult result) {
        if (result.hasErrors()) {
            return validation(result);
        }
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.editLogUser(authentication, user));
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
