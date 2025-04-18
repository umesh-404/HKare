package com.hkare.hkare_backend;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.event.EventListener;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.Map;

@SpringBootApplication
@ComponentScan(basePackages = "com.hkare.hkare_backend")
@EntityScan("com.hkare.hkare_backend.model")
@EnableJpaRepositories("com.hkare.hkare_backend.repository")
@Slf4j
public class HkareBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(HkareBackendApplication.class, args);
	}
	
	@Component
	public static class EndpointLogger {
		private final RequestMappingHandlerMapping requestMappingHandlerMapping;
		
		public EndpointLogger(RequestMappingHandlerMapping requestMappingHandlerMapping) {
			this.requestMappingHandlerMapping = requestMappingHandlerMapping;
		}
		
		@EventListener
		public void logEndpoints(ApplicationReadyEvent event) {
			log.info("Available endpoints:");
			Map<RequestMappingInfo, org.springframework.web.method.HandlerMethod> handlerMethods = 
					this.requestMappingHandlerMapping.getHandlerMethods();
			
			handlerMethods.forEach((mappingInfo, handlerMethod) -> {
				log.info("Endpoint: {} -> {}", mappingInfo, handlerMethod);
			});
		}
	}
}
