package org.kaznalnrprograms.Accounting.Configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jndi.JndiObjectFactoryBean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.naming.NamingException;
import javax.sql.DataSource;

@Configuration
public class JpaConfig {
    @Value("${JndiName}")
    private String jndiName;
    @Primary
    @Bean(name = "dataSource")
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource dataSource() throws NamingException {
        JndiObjectFactoryBean bean = new JndiObjectFactoryBean();           // create JNDI data source
        bean.setJndiName(jndiName);
        bean.setProxyInterface(DataSource.class);
        bean.setLookupOnStartup(false);
        bean.afterPropertiesSet();
        return (DataSource) bean.getObject();
    }
}
