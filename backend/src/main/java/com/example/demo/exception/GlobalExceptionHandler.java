package com.example.demo.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BusinessValidationException.class)
    ResponseEntity<Map<String,Object>> handleBusinnessValidationException(BusinessValidationException ex){
        return exceptionBuilder(HttpStatus.BAD_REQUEST,ex.getMessage());
    }
    @ExceptionHandler(ResourceNotFoundException.class)
    ResponseEntity<Map<String,Object>> handleResourceNotfoundException(ResourceNotFoundException ex){
        return exceptionBuilder(HttpStatus.NOT_FOUND,ex.getMessage());
    }
    @ExceptionHandler(RuntimeException.class)
    ResponseEntity<Map<String,Object>> handleRunTimeException(RuntimeException ex){
        return exceptionBuilder(HttpStatus.INTERNAL_SERVER_ERROR,ex.getMessage());
    }
    private ResponseEntity<Map<String,Object>> exceptionBuilder(HttpStatus status,String message){
        Map<String,Object> body=new LinkedHashMap<>();
        body.put("timestamp",LocalDateTime.now());
        body.put("value",status.value());
        body.put("error",status.getReasonPhrase());
        body.put("message",message);
        return new ResponseEntity<>(body,status);
    } 
}
