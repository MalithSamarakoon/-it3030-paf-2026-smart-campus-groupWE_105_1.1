package org.practicals.backend.config;

import org.practicals.backend.security.jwt.AuthTokenFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.practicals.backend.security.oauth2.OAuth2AuthenticationSuccessHandler;
import org.springframework.beans.factory.ObjectProvider;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final AuthTokenFilter authTokenFilter;
    private final OAuth2AuthenticationSuccessHandler oAuth2SuccessHandler;
    private final ObjectProvider<ClientRegistrationRepository> clientRegistrationRepository;


    public SecurityConfig(AuthTokenFilter authTokenFilter,
                          OAuth2AuthenticationSuccessHandler oAuth2SuccessHandler,
                          ObjectProvider<ClientRegistrationRepository> clientRegistrationRepository) {

        this.authTokenFilter = authTokenFilter;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
        this.clientRegistrationRepository = clientRegistrationRepository;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().requestMatchers("/images/**", "/files/**");
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                // CRITICAL for JWT: Set session management to STATELESS
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/images/**").permitAll()
                        .requestMatchers("/login/oauth2/**", "/oauth2/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN") // Role-based access
                        .requestMatchers(HttpMethod.GET, "/api/resources/**").hasAnyRole("STUDENT", "ADMIN")
                        .requestMatchers("/api/resources/**").hasRole("ADMIN")
                        // Booking endpoints: approve and reject are ADMIN-only
                        .requestMatchers("/api/bookings/*/approve", "/api/bookings/*/reject").hasRole("ADMIN")
                        // All other booking operations require authentication
                        .requestMatchers("/api/bookings/**").hasAnyRole("STUDENT", "ADMIN")
                        .requestMatchers("/api/tickets/**").authenticated() // Ticket endpoints
                        .anyRequest().authenticated()
                );

                if (clientRegistrationRepository.getIfAvailable() != null) {
                    http.oauth2Login(oauth2 -> oauth2.successHandler(oAuth2SuccessHandler));
                }


        http.addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "x-auth-token"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
