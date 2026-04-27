package com.grupo4.foodappback.validations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

/* Anotación de validación personalizada @ISREQUIRED para campos obligatorios: Se va a utilizar como 
  alternativa a @NotNull, @NotBlank o @NotEmpty, permitiendo una validación más flexible -> TODAS EN UNA */

// Indicamos la clase que contiene la lógica de validación:
@Constraint(validatedBy = RequiredValidation.class)

// Indicamos q la validación va a estar disponible en tiempo de ejecución:
@Retention(RetentionPolicy.RUNTIME)

// Indicamos q la validación PUEDE APLICARSE a atributos o campos (FIELD) o métodos (getters)
@Target({ ElementType.FIELD, ElementType.METHOD })

public @interface IsRequired {
    // Mensaje  por defecto cuando la validación falla:
    String message() default "es obligatorio!";
    
    Class<?>[] groups() default {};    
    Class<? extends Payload>[] payload() default {};
}