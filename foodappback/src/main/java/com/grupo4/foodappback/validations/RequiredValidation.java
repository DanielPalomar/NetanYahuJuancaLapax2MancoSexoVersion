package com.grupo4.foodappback.validations;

import org.springframework.util.StringUtils;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 * Valida que un campo de tipo {@link String} no sea null, vacío o solo espacios en blanco.
 * Se usa con la anotación personalizada {@code @IsRequired}.
 */
public class RequiredValidation implements ConstraintValidator<IsRequired, String> {

    /**
     * Verifica que el valor contenga al menos un carácter no blanco.
     *
     * @param value   el valor del campo a validar
     * @param context contexto de validación (no usado)
     * @return true si el valor tiene texto, false en caso contrario
     */
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return StringUtils.hasText(value);
    }
}
