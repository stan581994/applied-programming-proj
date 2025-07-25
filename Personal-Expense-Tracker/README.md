# Personal Expense Tracker

## Overview

This Personal Expense Tracker application is written in  Java enterprise development with relational database design, and the Spring Boot framework. This project demonstrates my ability to build full-stack web applications using modern Java technologies and best practices.

The software is a expense management system that allows users to track their personal finances by categorizing and managing expenses through a web interface. The application showcases advanced Java concepts including Object-Relational Mapping (ORM), dependency injection, MVC architecture, and database relationships.

[Software Demo Video](https://www.youtube.com/watch?v=N8OvO4N-WRc&feature=youtu.be)

## Development Environment

**IDE and Tools:**
- IntelliJ IDEA / Visual Studio Code for development
- Maven for dependency management and build automation
- Git for version control
- H2 Database Console for database administration
- Spring Boot DevTools for hot reloading during development

**Programming Language and Frameworks:**
- **Java 17** - Latest LTS version with modern language features
- **Spring Boot 3.5.3** - Main framework for application development
- **Spring Data JPA** - For database operations and ORM
- **Spring Web MVC** - For web layer and REST endpoints
- **Thymeleaf** - Server-side templating engine for dynamic HTML
- **H2 Database** - Embedded database for development and testing
- **Hibernate** - JPA implementation for object-relational mapping
- **Maven** - Build tool and dependency management

## Key Features

- **Expense Management**: Create, read, update, and delete expense records
- **Category System**: Organize expenses into predefined and custom categories
- **Database Relationships**: Demonstrates one-to-many relationships between categories and expenses
- **Data Initialization**: Intelligent startup system that seeds the database with default categories
- **Web Interface**: Clean, responsive web UI built with Thymeleaf templates
- **H2 Console Access**: Direct database access for development and debugging
- **RESTful Architecture**: Well-structured MVC pattern with proper separation of concerns

## Technical Highlights

- **JPA Annotations**: Proper use of @Entity, @OneToMany, @ManyToOne, @JoinColumn
- **Repository Pattern**: Custom query methods with Spring Data JPA
- **Dependency Injection**: Constructor-based injection following Spring best practices
- **Data Validation**: Entity validation and constraint handling
- **Configuration Management**: Externalized configuration using application.properties
- **Startup Hooks**: CommandLineRunner implementation for data initialization

## Database Schema

```sql
-- Category Table
CREATE TABLE Category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500)
);

-- Expense Table
CREATE TABLE Expense (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    category_id BIGINT,
    FOREIGN KEY (category_id) REFERENCES Category(id)
);
```

## How to Run

1. **Prerequisites**: Ensure Java 17+ and Maven are installed
2. **Clone the repository**: `git clone [repository-url]`
3. **Navigate to project directory**: `cd Personal-Expense-Tracker`
4. **Run the application**: `mvn spring-boot:run`
5. **Access the application**: Open browser to `http://localhost:8080`
6. **Database console**: Access H2 console at `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:file:./data/expense_tracker`
   - Username: `sa`
   - Password: `password`

## Useful Websites

- [Spring Boot Official Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [Thymeleaf Documentation](https://www.thymeleaf.org/documentation.html)
- [H2 Database Documentation](http://www.h2database.com/html/main.html)
- [Maven Getting Started Guide](https://maven.apache.org/guides/getting-started/)
- [Java 17 Documentation](https://docs.oracle.com/en/java/javase/17/)
- [JPA and Hibernate Tutorial](https://www.baeldung.com/hibernate-tutorial)
- [Spring Boot with H2 Database](https://www.baeldung.com/spring-boot-h2-database)

## Future Work

- **User Authentication**: Implement Spring Security for user login and registration
- **Expense Analytics**: Add charts and graphs for expense visualization using Chart.js
- **Budget Management**: Create budget tracking and alerts for overspending
- **Export Functionality**: Add PDF and Excel export capabilities for expense reports
