package org.kaznalnrprograms.Accounting.Configs;

import org.kaznalnrprograms.Accounting.Core.CustomAuthenticationProvider;
import org.kaznalnrprograms.Accounting.Core.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SpringSecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private CustomUserDetailsService userDetailsService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Bean
    public PasswordEncoder getPasswordEncoder(){
        return new BCryptPasswordEncoder(8);
    }
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .authorizeRequests()
                .antMatchers("/css/**", "/scripts/**","/Modules/MainApp/**","/Modules/Login/**", "/Login/**","/Modules/Core/FormView.js",
                        "/MainApp/MainFragment/", "/login/**","/logout").permitAll()
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .failureUrl("/login-error")
                .loginPage("/login")
                .permitAll()
                .defaultSuccessUrl("/MainApp")
                .and()
                .rememberMe()
                .and()
                .logout().permitAll().deleteCookies("JSESSIONID").logoutSuccessUrl("/MainApp");
    }
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(authenticationProvider());
    }
    @Bean
    public DaoAuthenticationProvider authenticationProvider(){
        CustomAuthenticationProvider authProvider = new CustomAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }
}
