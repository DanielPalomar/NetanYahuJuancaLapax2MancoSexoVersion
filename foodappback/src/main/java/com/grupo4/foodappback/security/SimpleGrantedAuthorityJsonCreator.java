package com.grupo4.foodappback.security;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/* Esta clase NO se usa directamente en ningún controlador ni servicio. Su función es ayudar a Jackson (el 
 * conversor JSON de Spring) a reconstruir objetos SimpleGrantedAuthority desde JSON. Es CLAVE cuando se trabaja con:
 * - JWT
 * - Roles
 * - Postman enviando tokens */

public abstract class SimpleGrantedAuthorityJsonCreator {

    /* @JsonCreator indica a Jackson el constructor vacío a usar cuando convierte un JSON a un objeto Java.     
     * @JsonProperty("authority") indica que el campo "authority" del JSON corresponde al rol (ROLE_USER, ROLE_ADMIN).
     * Ejemplo de JSON dentro del JWT:
     * {
     *   "authority": "ROLE_ADMIN"
     * }  
     *    
     * Postman NO llama a esta clase, pero cuando Postman envía el token JWT tipo "application/json (Authorization: 
     * Bearer TOKEN), entonces Spring Security lo q hace es:
     * - Decodifica el token
     * - Convierte los roles del JSON a SimpleGrantedAuthority
     * - Usa esta clase para hacerlo correctamente
     */
    @JsonCreator
    public SimpleGrantedAuthorityJsonCreator(@JsonProperty("authority") String role) {
        // Constructor vacío q solo se usa para la deserialización JSON (convertirlo a Java)
    }

}
