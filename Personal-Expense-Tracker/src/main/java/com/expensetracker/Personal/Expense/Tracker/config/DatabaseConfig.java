package com.expensetracker.Personal.Expense.Tracker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(basePackages = "com.expensetracker.Personal.Expense.Tracker")
@EnableTransactionManagement
public class DatabaseConfig {
    // Configuration for database if needed
}
