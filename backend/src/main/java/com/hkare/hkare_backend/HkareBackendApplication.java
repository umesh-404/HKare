package com.hkare.hkare_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {
    "com.hkare.hkare_backend.controller", 
    "com.hkare.hkare_backend.service",
    "com.hkare.hkare_backend.config"
})
public class HkareBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(HkareBackendApplication.class, args);
	}

}
