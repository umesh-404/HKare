package com.hkare.hkare_backend.config;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableWebMvc
@Slf4j
public class WebConfig implements WebMvcConfigurer {

    @PostConstruct
    public void init() {
        log.info("WebConfig initialized - configuring CORS mappings");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        log.info("Setting up CORS configurations");
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);
        
        log.info("CORS mappings configured for all endpoints");
    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        log.info("Setting up resource handlers");
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
        
        log.info("Resource handlers configured");
    }
} 