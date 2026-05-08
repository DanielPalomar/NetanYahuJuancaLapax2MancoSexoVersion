package com.grupo4.foodappback.security.filter;

import static com.grupo4.foodappback.security.TokenJwtConfig.CONTENT_TYPE;
import static com.grupo4.foodappback.security.TokenJwtConfig.SECRET_KEY;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.grupo4.foodappback.entities.User;

import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

/*
 * FILTRO DE  -- AUTENTICACION --   JWT ->  Se ejecuta cuando Postman hace POST /login
 * Su función:
 * - Leer username y password del body
 * - Autenticar con Spring Security
 * - Generar JWT a partir de username, password y otros datos (si la autenticación es correcta, es decir, si username y psw están en la tabla users) */

public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    // instanciamos AuthenticationManager: se usa para autenticar usuario/contraseña
    private AuthenticationManager authenticationManager;

     // Constructor: recibe el AuthenticationManager desde la configuración
    public JwtAuthenticationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    /* ===============================
     * Intento de autenticación
     * ===============================
     * si usamos POSTMAN:
     * - POST http://localhost:8080/login
     * - Headers: Content-Type: application/json
     * - Body (raw JSON):
     * {
     * "username": "admin",
     * "password": "1234"
     * }
     */
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
                                                HttpServletResponse response) throws AuthenticationException { //excepción de Spring Security
        // Leer username y password del request: puede venir como JSON (API) o como form-data (formulario HTML)
        try {
            String username = null;
            String password = null;

            // Para recibir los datos de JSON (API) o de form-urlencoded (Thymeleaf)
            if (request.getContentType() != null && request.getContentType().contains("application/json")) {

                 // 👉 Caso API: leer JSON del body
                User loginRequest = new ObjectMapper().readValue(request.getInputStream(), User.class);
                    username = loginRequest.getUsername();
                    password = loginRequest.getPassword();
            } else {
                 // 👉 Caso formulario HTML
                username = request.getParameter("username");
                password = request.getParameter("password");
            }

            // Crear objeto de autenticación con username y password
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(username, password);

            // Spring valida credenciales (usa UserDetailsService + PasswordEncoder)
            return authenticationManager.authenticate(authToken);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /* ===============================
     * Autenticación exitosa
     * ===============================
     * - Se genera el token JWT y se envía en el header "Authorization"
     * - Se devuelve JSON con token y mensaje
     *
     * POSTMAN:
     * - Header devuelto: Authorization: Bearer <TOKEN>
     * - Body devuelto:
     * {
     * "token": "...",
     * "username": "admin",
     * "message": "Hola admin has iniciado sesion con exito!"
     * }
     */
    @Override
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain chain,
                                            Authentication authResult) throws IOException, ServletException {

        // Obtener usuario autenticado y su username: usamos directamente la clase userdetails en lugar de instanciarla arriba
        org.springframework.security.core.userdetails.User user = 
                (org.springframework.security.core.userdetails.User) authResult.getPrincipal();
        String username = user.getUsername();

        // Generar Map para construir el token JWT a partir del username anterior y de los roles(authorities):
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", username);
        claims.put("authorities", user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));      
        
        /*¿Qué contiene un token JWT?
            Username
            Roles
            Fecha de expiración (en este caso, 1 hora despues)
            Firma digital
            Nunca la contraseña
        */
        // Generar el token:
        String token = Jwts.builder()
                .subject(username)
                .claims(claims)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(SECRET_KEY)
                .compact();

        // Construimos la response con el token según el tipo de request:                                        
        if (request.getContentType() != null && request.getContentType().contains("application/json")) {
            
            // Verificamos si tiene el rol de administrador
            boolean esAdministrador = user.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            // Si la petición es API → devolver una response JSON con un objeto tipo Map:
            Map<String, Object> body = new HashMap<>();
                body.put("token", token);
                body.put("usuario", username);
                body.put("esAdministrador", esAdministrador);
            
            response.getWriter().write(new ObjectMapper().writeValueAsString(body));
            response.setContentType(CONTENT_TYPE);
            response.setStatus(200);

        } else {

            // Si la petición es Thymeleaf → poner el token en una cookie y ésta en la response, y redirigir:
            Cookie jwtCookie = new Cookie("token", token);
                jwtCookie.setHttpOnly(true);
                jwtCookie.setPath("/");
                jwtCookie.setMaxAge(3600); // 1 hora
            response.addCookie(jwtCookie);
            response.sendRedirect("/home");     // PÁGINA A LA Q NOS DIRIGE DESPUES DE AUTENTICAR
        }
    }

    /* ===============================
     * Autenticación fallida
     * ===============================
     * POSTMAN:
     * - Si username/password incorrectos -> Respuesta HTTP 401 con un body de este tipo:
     * {
     * "message": "Error en la autenticacion username o password incorrectos!",
     * "error": "Bad credentials"
     * }     */

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            AuthenticationException failed) throws IOException, ServletException {

        // construimos la response sin token según el tipo de request:                                        
        if (request.getContentType() != null && request.getContentType().contains("application/json")) {
            
            // API → JSON
            Map<String, String> body = new HashMap<>();
                body.put("message", "Error en la autenticación username o password incorrectos!");
                body.put("error", failed.getMessage());
            response.getWriter().write(new ObjectMapper().writeValueAsString(body));
            response.setStatus(401);
            response.setContentType(CONTENT_TYPE);
        
        } else {
           
            // Thymeleaf → redirigir con error
            response.sendRedirect("/login?error=true");     // PÁGINA A LA Q NOS DIRIGE SI NO AUTENTICAMOS
        }
    }

}

