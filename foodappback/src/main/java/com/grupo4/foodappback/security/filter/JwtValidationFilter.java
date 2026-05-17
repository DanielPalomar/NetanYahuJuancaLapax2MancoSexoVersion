package com.grupo4.foodappback.security.filter;

import static com.grupo4.foodappback.security.TokenJwtConfig.CONTENT_TYPE;
import static com.grupo4.foodappback.security.TokenJwtConfig.HEADER_AUTHORIZATION;
import static com.grupo4.foodappback.security.TokenJwtConfig.PREFIX_TOKEN;
import static com.grupo4.foodappback.security.TokenJwtConfig.SECRET_KEY;

import java.io.IOException;
import java.util.Collection;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.ObjectMapper;

/*Esta clase es un filtro de seguridad que se ejecuta en cada petición y hace lo siguiente:
-Comprueba si hay un token JWT en la cabecera
-Si lo hay, lo valida
-Extrae el usuario y sus roles
-Los guarda en el SecurityContext de Spring O sea, 
-Convierte el token JWT en un usuario autenticado que Spring puede usar para autorizar la petición (con .authenticated y @PreAuthorize)*/

public class JwtValidationFilter extends BasicAuthenticationFilter {

    // Constructor de la clase: recibe el AuthenticationManager de Spring Security
    public JwtValidationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
    }

    // Método principal del filtro: se ejecuta en CADA petición HTTP
    // Este filtro es el que convierte un token JWT en un usuario autenticado dentro
    // de Spring
    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws IOException, ServletException {

        // System.out.println("METHOD: " + request.getMethod());
        // System.out.println("AUTH HEADER: " + request.getHeader("Authorization"));

        // Obtener la ruta de la petición
        String path = request.getServletPath();

        // ENDPOINTS PÚBLICOS (no validar JWT aquí)
        if (path.equals("/api/users/register") || path.equals("/login")) {
            chain.doFilter(request, response); // continuar sin validar
            return;
        }

        // Obtener header Authorization
        String header = request.getHeader(HEADER_AUTHORIZATION);

        // SI NO HAY TOKEN o no empieza por "Bearer " → dejar pasar (Spring decidirá
        // luego si bloquea)
        if (header == null || !header.startsWith(PREFIX_TOKEN)) {
            chain.doFilter(request, response);
            return;
        }

        // Extraer el token quitando el prefijo "Bearer"
        String token = header.replace(PREFIX_TOKEN, "");

        try {
            // Validar token
            Claims claims = Jwts.parser()
                    .verifyWith(SECRET_KEY) // verifica firma con clave secreta
                    .build()
                    .parseSignedClaims(token)
                    .getPayload(); // obtiene los datos del token

            // Obtener username del token
            String username = claims.get("username", String.class);

            // List<String> rolesList = claims.get("authorities", List.class);
            // Collection<? extends GrantedAuthority> authorities = rolesList.stream()
            // .map(SimpleGrantedAuthority::new)
            // .collect(Collectors.toList());

            // Obtener roles (authorities) del token
            Object rawRoles = claims.get("authorities");

            // Convertir roles a GrantedAuthority (formato que Spring entiende)
            Collection<? extends GrantedAuthority> authorities = ((List<?>) rawRoles).stream()
                    .map(role -> {
                        // Caso 1: si el rol es String (ej: "ROLE_ADMIN")
                        if (role instanceof String) {
                            return new SimpleGrantedAuthority((String) role);
                        }
                        // Caso 2: si viene como Map (cuando Jackson serializa objetos)
                        if (role instanceof java.util.Map) {
                            return new SimpleGrantedAuthority(
                                    (String) ((java.util.Map<?, ?>) role).get("authority"));
                        }

                        return null;
                    })
                    .filter(java.util.Objects::nonNull) // eliminar nulos
                    .toList();

            // Crear objeto Authentication con username y roles
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, null,
                    authorities);

            // GUARDAR AUTENTICACIÓN EN EL CONTEXTO DE SPRING - esto es lo que hace que
            // Spring "sepa" quién se ha logueado
            SecurityContextHolder.getContext().setAuthentication(authToken);

            // System.out.println("AUTH OBJECT: " + authToken);
            // System.out.println("ROLES: " + authToken.getAuthorities());

            // Continuar con la cadena de filtros
            chain.doFilter(request, response);

        } catch (JwtException e) {

            // TOKEN INVÁLIDO: se devuelve error 401 (no autorizado)
            // SOLO bloquear si el endpoint es protegido
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(CONTENT_TYPE);

            // Respuesta JSON con error
            new ObjectMapper().writeValue(response.getWriter(),
                    new java.util.HashMap<String, String>() {
                        {
                            put("error", e.getMessage());
                            put("message", "El token JWT es invalido!");
                        }
                    });
        }
    }
}