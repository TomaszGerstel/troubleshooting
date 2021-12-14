package com.tg.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	
	@Bean
    public UserDetailsService userDetailsService() {
        return new CustomUserDetailsService();
    }

	@Bean
    public PasswordEncoder passwordEncoder() {
        PasswordEncoder passwordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
        return passwordEncoder;
    }
	
	@Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());         
        return authProvider;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
        .headers().frameOptions().disable().and()
        .httpBasic().and()
        .csrf().disable()
   //         .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()).and()
        .authorizeRequests()
        	.antMatchers("/api/user/register").permitAll()
        	.antMatchers("/api/problem/comments").permitAll()
            .antMatchers(HttpMethod.POST).authenticated()
            .antMatchers(HttpMethod.DELETE).authenticated()
            .antMatchers("/api/problem/newProblem").access("hasRole('ADMIN')")
            .and()
        .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }
    
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(authenticationProvider());
    }

//    @Override
//    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
//        auth.userDetailsService(userDetailsService())
//        .passwordEncoder(passwordEncoder());
//        
//        auth.inMemoryAuthentication()   
//        .withUser("Tomasz").password("{noop}pass1").roles("USER").and()
//        .withUser("Romek").password("{noop}pass2").roles("USER");
//    }
}