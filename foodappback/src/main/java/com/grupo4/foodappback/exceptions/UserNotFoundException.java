package com.grupo4.foodappback.exceptions;

//clase para crear una excepcion personalizada que vamos a llamar UserNotFoundException:
public class UserNotFoundException extends RuntimeException{
    
    public UserNotFoundException(String message) {
        super(message);
    } 
    
}