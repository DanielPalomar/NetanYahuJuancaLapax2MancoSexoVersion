package com.grupo4.foodappback.validations;

import org.springframework.util.StringUtils;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/*
 Implementación de la validación personalizada @IsRequired. Comprueba que CUALQUIER campo de tipo String:
       - No sea null,
       - No esté vacío,
       - No contenga solo espacios en blanco.
 */
public class RequiredValidation implements ConstraintValidator<IsRequired, String> {

    /**
     Método ---isValid--- que se ejecuta automáticamente durante la validación (NO USAMOS MÉTODOS DEL SERVICE):
        @param value: valor del campo a validar.
        @param context: contexto de validación.
        @return TRUE si el valor es válido, FALSE si el valor es nulo, vacío o solo espacios.
     */
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {

        /* Método ---StringUtils.hasText--- q devuelve TRUE si:
              - value != null,
              - contiene al menos un carácter no blanco
        */
        return StringUtils.hasText(value);

        // Implementación equivalente (otra forma):
        //      return (value != null && !value.isEmpty() && !value.isBlank());
    }
}
