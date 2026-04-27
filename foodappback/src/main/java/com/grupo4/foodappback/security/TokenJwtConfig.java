package com.grupo4.foodappback.security;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Jwts;

/* CONFIGURACIÓN DE JWT para la aplicación -> Contiene las constantes que se usan:
 * - Para generar y validar JWT - SECRET_KEY 
 * - Para definir cómo Postman debe enviar el token - PREFIX_TOKEN, HEADER_AUTHORIZATION y CONTENT_TYPE
 * esta información la usa la clase JwtAuthenticationFilter para generar el token.
 * JWT significa JSON Web Token. Es un estándar (definido por Internet Engineering Task Force) que se usa 
 * para autenticación y transmisión segura de información entre 2 partes, normalmente en aplicaciones web.
 */

public class TokenJwtConfig {
    
    /* Clave secreta para FIRMAR LOS TOKENS JWT:
     * - Se usa para CREAR y validar el token
     * - Nunca debe exponerse en producción
     *
     * Postman no necesita esta clave directamente, pero es imprescindible para que Spring valide los tokens.     */
    public static final SecretKey SECRET_KEY = Jwts.SIG.HS256.key().build();

    // Prefijo que debe enviar Postman en el header Authorization -> En Postman se usa el prefijo BEARER, q indica q el token es tipo JWT:    
    public static final String PREFIX_TOKEN = "Bearer ";

    // Nombre del HEADER donde Postman debe enviar el token:
    public static final String HEADER_AUTHORIZATION = "Authorization";

    // Tipo de contenido que Postman debe enviar al hacer POST /login o POST /api/users/register: Content-Type: application/json
    public static final String CONTENT_TYPE = "application/json";
}
