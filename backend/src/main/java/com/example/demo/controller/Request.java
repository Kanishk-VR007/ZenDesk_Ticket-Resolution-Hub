package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Request {
    @GetMapping("/hello")
    String message(@RequestParam String Name){
        return "hello" + Name;
    }
}
