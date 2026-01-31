package com.neverlucky.login.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {
    @Bean
    @Profile("production")
    public DataSource postgresqlDataSource() {
        try {
            String databaseUrl = System.getenv("DATABASE_URL");

            if (databaseUrl == null || databaseUrl.isBlank()) {
                throw new IllegalStateException("DATABASE_URL is not set in production profile");
            }

            URI dbUri = new URI(databaseUrl);

            String[] userInfo = dbUri.getUserInfo().split(":");
            String username = userInfo[0];
            String password = userInfo[1];

            String jdbcUrl = "jdbc:postgresql://" +
                    dbUri.getHost() +
                    ":" + dbUri.getPort() +
                    dbUri.getPath();

            DriverManagerDataSource dataSource = new DriverManagerDataSource();
            dataSource.setDriverClassName("org.postgresql.Driver");
            dataSource.setUrl(jdbcUrl);
            dataSource.setUsername(username);
            dataSource.setPassword(password);

            return dataSource;

        } catch (Exception e) {
            throw new RuntimeException("Failed to configure PostgreSQL DataSource", e);
        }
    }
}
