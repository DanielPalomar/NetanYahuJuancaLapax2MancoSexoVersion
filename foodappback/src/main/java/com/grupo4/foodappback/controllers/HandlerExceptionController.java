package com.grupo4.foodappback.controllers;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import com.grupo4.foodappback.entities.Error;
import com.grupo4.foodappback.exceptions.BusinessException;
import com.grupo4.foodappback.exceptions.UserNotFoundException;


@RestControllerAdvice 
public class HandlerExceptionController { 
  
//maneja errores de valdación (400 - bad request):-> Spring lanza MethodArgumentNotValidException cuando se usa @Valid.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)

    public Map<String, Object> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error ->
                        errors.put(error.getField(), error.getDefaultMessage())
                );
        return Map.of(
                "error", "Error de validación",
                "message", "Petición errónea",
                "details", errors
        );
        
    }

// Maneja recursos no encontradod(404 Not Found):
    @ExceptionHandler(NoHandlerFoundException.class)

    public ResponseEntity<Error> notFoundEx(NoHandlerFoundException e) {         
        Error error = new Error();
        error.setDate(new Date());
        error.setError("recurso no encontrado");
        error.setMessage(e.getMessage());
        error.setStatus(HttpStatus.NOT_FOUND.value());
        // Devuelve el error con código 404
        return ResponseEntity.status(HttpStatus.NOT_FOUND.value()).body(error);
    }
    
// Maneja UserNotFoundException (500 INTERNAL_SERVER_ERROR):
    @ExceptionHandler({UserNotFoundException.class})
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    
    public Map<String, Object> handleuserNotFoundException(Exception ex){
        Map<String, Object> error = new HashMap<>();
        error.put("date", new Date());
        error.put("error", "el usuario no existe!");
        error.put("message", ex.getMessage());  
        error.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        return error;
    }

//maneja AuthenticationException (401 - Unauthorized):
    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)

    public Map<String, Object> handleAuthException(AuthenticationException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("date", new Date());
        error.put("error", "proceda a loguearse");
        error.put("message", ex.getMessage());  
        error.put("status", HttpStatus.UNAUTHORIZED.value());
        return error;
    }

//maneja AccessDeniedException (403 - Forbidden):
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)

    public Map<String, Object> handleAccessDenied(AccessDeniedException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("date", new Date());
        error.put("error", "usted no tiene permisos");
        error.put("message", ex.getMessage());  
        error.put("status", HttpStatus.UNAUTHORIZED.value());
        return error;
    }

//maneja errores de negocio:
    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)

    public Map<String, Object> handleBusinessException(BusinessException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("date", new Date());
        error.put("error", "petición errónea!");
        error.put("message", ex.getMessage());  
        error.put("status", HttpStatus.BAD_REQUEST.value());
        return error;
    }

 
//maneja runtimeExceptions:
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}
