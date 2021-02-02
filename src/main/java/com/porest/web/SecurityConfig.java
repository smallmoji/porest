package com.porest.web;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.session.web.http.HeaderHttpSessionStrategy;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private DataSource dataSource;
	
	 @Autowired
	    public void configAuthentication(AuthenticationManagerBuilder auth) throws Exception {
	        auth.jdbcAuthentication().passwordEncoder(new BCryptPasswordEncoder())
	            .dataSource(dataSource)
	            .usersByUsernameQuery("select email, password, is_enabled from user_account where email=?")
	            .authoritiesByUsernameQuery("select email, role from user_account where email=?");
	    }
		
		@Override
		protected void configure(HttpSecurity http) throws Exception {

			http
					.csrf().disable()
					.sessionManagement()
					.sessionCreationPolicy(SessionCreationPolicy.NEVER)
					.and()
					.authorizeRequests()
					.anyRequest().permitAll()
			.and();
		}
		
//		@Override
//		protected void configure(HttpSecurity http) throws Exception {
//		    http.authorizeRequests()
//		        .anyRequest().authenticated()
//		        .and()
//		        .formLogin().permitAll()
//		        .and()
//		        .logout().permitAll();     
//		}

		@Bean
		public AuthenticationManager authenticationManagerBean() throws Exception {
			return super.authenticationManagerBean();
		}

		@Bean
		public PasswordEncoder passwordEncoder() {
			return new BCryptPasswordEncoder();
		}

		@Bean
		public HeaderHttpSessionStrategy headerHttpSessionStrategy() {
			return new HeaderHttpSessionStrategy();
		}
	
}
