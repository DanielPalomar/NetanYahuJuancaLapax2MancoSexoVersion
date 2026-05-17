package com.grupo4.foodappback.security;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.grupo4.foodappback.security.filter.JwtAuthenticationFilter;
import com.grupo4.foodappback.security.filter.JwtValidationFilter;

/* Clase de CONFIGURACIÓN DE SPRING SECURITY -> define Qué endpoints son públicos, cuáles 
 * están protegidos, cómo se va a autenticar el usuario (con JWT), y qué debe enviar Postman
 */
@Configuration
// Anotación q habilita las anotaciones @PreAuthorize("hasRole('ADMIN')"):
@EnableMethodSecurity(prePostEnabled = true)

public class SpringSecurityConfig {

    // Proporciona el AuthenticationManager de Spring:
    @Autowired
    private AuthenticationConfiguration authenticationConfiguration;

    /*
     * AUTHENTICATIONMANAGER: se usa en:
     * - JwtAuthenticationFilter (login)
     * - JwtValidationFilter (validar token)
     * Postman lo activa cuando hace POST /login
     */
    @Bean
    AuthenticationManager authenticationManager() throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /*
     * CODIFICADOR DE CONTRASEÑAS: consigue q la contraseña enviada desde Postman:
     * - Se cifra al guardar
     * - Se compara cifrada en el login
     */
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /*
     * ===========================
     * CONFIGURACIÓN DE SEGURIDAD
     * ===========================
     */

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        return http.authorizeHttpRequests(authz -> authz
                // Login y registro públicos:
                .requestMatchers(HttpMethod.GET, "/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users/register").permitAll()

                // Recursos estáticos
                .requestMatchers("/css/**", "/js/**", "/images/**").permitAll()

                // Options
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Resto de peticiones
                .anyRequest().authenticated())

                /*
                 * Filtro de AUTENTICACIÓN: equivale a un endpoint "/login".
                 * ========================================================
                 * Usamos este endpoint haciendo POST /login y se devuelve un JWT (token) en una
                 * response
                 */
                .addFilter(new JwtAuthenticationFilter(authenticationManager()))

                /*
                 * Filtro de VALIDACIÓN: se ejecuta cuando añadimos el token: Authorization:
                 * Bearer TOKEN
                 * ========================================================
                 */
                .addFilterBefore(
                        new JwtValidationFilter(authenticationManager()),
                        UsernamePasswordAuthenticationFilter.class)

                // Se desactiva CSRF (API REST):
                .csrf(config -> config.disable())

                // Configuración CORS -> Postman NO necesita nada especial:
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // API sin sesiones (stateless) (JWT):
                .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .build();

    } // fin configuracion seguridad

    /*
     * ====================
     * CONFIGURACIÓN CORS
     * ====================
     * Permite peticiones desde:
     * - Angular
     * - Postman
     * - Navegador
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // Permite cualquier origen
        config.setAllowedOriginPatterns(Arrays.asList("*"));

        // Métodos HTTP permitidos:
        config.setAllowedMethods(Arrays.asList("GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"));

        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With"));

        config.setAllowCredentials(false);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    } // fin configuración CORS

    /*
     * ============================================
     * Registro del filtro CORS con prioridad máxima
     * =============================================
     */
    @Bean
    FilterRegistrationBean<CorsFilter> corsFilter() {

        FilterRegistrationBean<CorsFilter> corsBean = new FilterRegistrationBean<>(
                new CorsFilter(corsConfigurationSource()));

        corsBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return corsBean;
    }
}
