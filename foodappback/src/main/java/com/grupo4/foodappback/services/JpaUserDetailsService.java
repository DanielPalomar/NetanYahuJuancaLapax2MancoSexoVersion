package com.grupo4.foodappback.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grupo4.foodappback.entities.User;
import com.grupo4.foodappback.repositories.IUserRepository;

/* Servicio que Spring Security utiliza automáticamente para cargar los usuarios desde la base de datos.
 * NO se llama directamente desde Postman: se ejecuta cuando Postman hace LOGIN o envía un TOKEN JWT. */

@Service
public class JpaUserDetailsService implements UserDetailsService {

    // Repositorio para acceder a la tabla de usuarios:
    @Autowired
    private IUserRepository repository;

    /* Método que Spring Security llama automáticamente cuando un cliente (Postman) intenta autenticarse.
     * - Cuando se hace login con username y contraseña, o
     * - Cuando se envía Authorization: Bearer TOKEN     */
    @Transactional(readOnly = true)
    @Override
    public UserDetails loadUserByUsername(String username) 
            throws UsernameNotFoundException {

        // Se busca el user en la BD por username (dato enviado desde Postman en el login):
        Optional<User> userOptional = repository.findByUsername(username);

        // Si el usuario no existe, se lanza excepción:
        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException(String.format("Username %s no existe en el sistema!", username));
        }

        // Pasamos el Optional a User:
        User user = userOptional.orElseThrow();

        /* Se convierten los roles del user encontrado en la BD (por ejemplo, ROLE_USER) a una lista de 
         * objetos GrantedAuthority. Estos roles son los que Spring usa para @PreAuthorize("hasRole('ADMIN')") */
        List<GrantedAuthority> authorities = user.getRoles()
                                        .stream()
                                        .map(role -> new SimpleGrantedAuthority(role.getName()))
                                        .collect(Collectors.toList());

        /*
         * Se devuelve un objeto UserDetails que Spring Security entiende. Usamos su clase aqui directamente:
         * Parámetros:
         * - username: enviado desde Postman
         * - password: contraseña cifrada en BD
         * - enabled: si el usuario está activo
         * - accountNonExpired: true
         * - credentialsNonExpired: true
         * - accountNonLocked: true
         * - authorities: lista de roles del usuario en formato GrantedAuthority
         */
        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            user.isEnabled(),
            true,
            true,
            true,
            authorities
        );
        /*El UserDetails es el objeto que contiene:
            👤 username
            🔒 password
            🟢 estado (enabled)
            🛡️ roles (authorities)

            👉 Es la representación del usuario que Spring Security entiende*/
    }
}
