package com.supermarket.stockmanagement.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Stock Management API")
                        .version("1.0.0")
                        .description("""
                            <h3>RESTful API for Supermarket Stock Management System</h3>
                            <h4>Getting Started:</h4>
                            <ol>
                                <li><strong>Register/Login:</strong> Use the <code>/api/auth/register</code> or <code>/api/auth/login</code> endpoints to get a JWT token</li>
                                <li><strong>Authorize:</strong> Click the <strong>"Authorize"</strong> button above and enter: <code>Bearer &lt;your-token&gt;</code></li>
                                <li><strong>Test APIs:</strong> Now you can test all protected endpoints!</li>
                            </ol>
                            <p><strong>Note:</strong> The login endpoint returns an <code>accessToken</code> in the response. Copy that token and use it in the Authorize button.</p>
                            """)
                        .contact(new Contact()
                                .name("Stock Management Team")
                                .email("support@stockmanagement.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")))
                .servers(Arrays.asList(
                        new Server().url("http://localhost:8080").description("Local Development Server")
                ))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication", 
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("""
                                            <strong>How to get your token:</strong>
                                            <ol>
                                                <li>Use the <code>/api/auth/login</code> endpoint below</li>
                                                <li>Enter your email and password</li>
                                                <li>Click "Execute" and copy the <code>accessToken</code> from the response</li>
                                                <li>Paste it here (or use format: <code>Bearer &lt;token&gt;</code>)</li>
                                            </ol>
                                            """)));
    }
}

