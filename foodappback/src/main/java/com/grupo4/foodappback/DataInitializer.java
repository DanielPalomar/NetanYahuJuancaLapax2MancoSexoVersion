package com.grupo4.foodappback;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.grupo4.foodappback.entities.Role;
import com.grupo4.foodappback.entities.User;
import com.grupo4.foodappback.repositories.IRoleRepository;
import com.grupo4.foodappback.repositories.IUserRepository;
import com.grupo4.foodappback.services.UserService;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private IRoleRepository roleRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) throws Exception {
        // 1. Crear roles si no existen
        if (roleRepository.findByName("ROLE_USER").isEmpty()) {
            Role userRole = new Role();
            userRole.setName("ROLE_USER");
            roleRepository.save(userRole);
            System.out.println("Rol ROLE_USER creado.");
        }

        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            Role adminRole = new Role();
            adminRole.setName("ROLE_ADMIN");
            roleRepository.save(adminRole);
            System.out.println("Rol ROLE_ADMIN creado.");
        }

        // 2. Crear usuario normal si no existe
        if (!userRepository.existsByUsername("juan")) {
            User user = new User();
            user.setName("Juan");
            user.setLastname("Perez");
            user.setUsername("juan");
            user.setEmail("juan@example.com");
            user.setPassword("juan");
            user.setAdmin(false);
            
            userService.registerUser(user);
            System.out.println("Usuario normal 'juan' creado.");
        }

        // 3. Crear usuario admin si no existe
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setName("Administrador");
            admin.setLastname("Sistema");
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword("admin");
            admin.setAdmin(true);
            
            userService.registerUser(admin);
            System.out.println("Usuario admin 'admin' creado.");
        }
    }
}
