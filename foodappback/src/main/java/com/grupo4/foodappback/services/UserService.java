package com.grupo4.foodappback.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.grupo4.foodappback.entities.Role;
import com.grupo4.foodappback.entities.User;
import com.grupo4.foodappback.exceptions.UserNotFoundException;
import com.grupo4.foodappback.repositories.IRoleRepository;
import com.grupo4.foodappback.repositories.IUserRepository;

import jakarta.transaction.Transactional;

// MANEJO DE LA BD DE USERS. CON ESTO NO SE PUEDE GUARDAR UN USER ADMIN

@Service
public class UserService {

    @Autowired
    IUserRepository userRepository;

    @Autowired
    IRoleRepository roleRepository;

    /*
     * Codificador de contraseñas (BCrypt normalmente)
     * La contraseña enviada desde Postman se cifra aquí
     */
    @Autowired
    private PasswordEncoder passwordEncoder;

    // MÉTODO SIN AUTHENTICATION
    // =========================
    @Transactional
    public User registerUser(User user) {
        // para sustituir a las validaciones personalizadas:
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("El email ya existe");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("El username ya existe");
        }

        // Busca el rol con nombre ROLE_USER en el repo:
        Optional<Role> optionalRoleUser = roleRepository.findByName("ROLE_USER");

        // Crea la lista de roles del nuevo user:
        List<Role> roles = new ArrayList<>();

        // Añade el optionalRuleUser a la lista de roles del nuevo user:
        optionalRoleUser.ifPresent(roles::add);

        // Si el user es admin, le asignamos también ese rol a su lista:
        if (user.isAdmin()) {
            Optional<Role> optionalRoleAdmin = roleRepository.findByName("ROLE_ADMIN");
            optionalRoleAdmin.ifPresent(roles::add);
        }

        user.setRoles(roles);

        // Se codifica la contraseña con el encoder que hemos puesto arriba. NUNCA se
        // debe guardar en texto plano.
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return userRepository.save(user);
    }

    // Buscar usuario existente por su username (SIN ENDPOINT):
    // public boolean existsByUsername(String username) {
    // return userRepository.existsByUsername(username);
    // }

    // Buscar usuarios existentes por su email (SIN ENDPOINT):
    // public boolean existsByEmail(String email) {
    // return userRepository.existsByEmail(email);
    // }

    // MÉTODO CON AUTHENTICATION
    // ==========================
    @Transactional
    public User editLogUser(Authentication authentication, User user) {
        String username = authentication.getName();
        User userFound = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));
        ;

        userFound.setName(user.getName());

        userFound.setLastname(user.getLastname());

        if (!userFound.getUsername().equals(user.getUsername())
                && userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("El username ya existe");
        }
        userFound.setUsername(user.getUsername());

        if (!userFound.getEmail().equals(user.getEmail()) && userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("El email ya existe");
        }
        userFound.setEmail(user.getEmail());

        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            userFound.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return null;
    }

    // MÉTODOS EXCLUSIVOS DEL ROL ADMIN:
    // ==================================

    // Ver listado users:
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Buscar un user por su ID:
    public User getUser(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // Modificar un user existente:
    @Transactional
    public User editUser(User user, Long id) {
        User userFound = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        userFound.setName(user.getName());

        userFound.setLastname(user.getLastname());

        if (!userFound.getUsername().equals(user.getUsername())
                && userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("El username ya existe");
        }
        userFound.setUsername(user.getUsername());

        if (!userFound.getEmail().equals(user.getEmail()) && userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("El email ya existe");
        }
        userFound.setEmail(user.getEmail());

        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            userFound.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        // Añadir roles al usuario:
        Role roleAdmin = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
        Role roleUser = roleRepository.findByName("ROLE_USER").orElseThrow();

        userFound.getRoles().clear();
        userFound.getRoles().add(roleUser);

        // solo se puede poner ROLE_ADMIN al admin -> si queremos más admins tenemos que
        // ir a la tabla
        if (user.isAdmin()) {
            userFound.getRoles().add(roleAdmin);
        }

        return userRepository.save(userFound);
    }

    // Borrar un user y devolver la lista de users:
    public List<User> deleteUser(Long id) {
        userRepository.deleteById(id);
        return userRepository.findAll();
    }

    // Activar un user:
    @Transactional
    public User activateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        user.setEnabled(!user.isEnabled());

        return userRepository.save(user);
    }
}
