package com.expensetracker.Personal.Expense.Tracker.config;

import com.expensetracker.Personal.Expense.Tracker.model.Category;
import com.expensetracker.Personal.Expense.Tracker.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Autowired
    public DataInitializer(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) {
        // Initialize categories on startup
        initializeDefaultCategories();
        
        // Add any additional custom categories
        addCustomCategories();
    }
    
    /**
     * Initialize default categories if database is empty
     */
    private void initializeDefaultCategories() {
        if (categoryRepository.count() == 0) {
            List<Category> defaultCategories = getDefaultCategories();
            categoryRepository.saveAll(defaultCategories);
            System.out.println("✅ " + defaultCategories.size() + " default categories have been added to the database.");
        } else {
            System.out.println("ℹ️ Categories already exist in database. Skipping default initialization.");
        }
    }
    
    /**
     * Add custom categories that don't already exist
     * This method runs every startup to ensure new categories are added
     */
    private void addCustomCategories() {
        List<Category> customCategories = getCustomCategories();
        int addedCount = 0;
        
        for (Category category : customCategories) {
            // Check if category with this name already exists
            if (!categoryRepository.existsByName(category.getName())) {
                categoryRepository.save(category);
                addedCount++;
                System.out.println("➕ Added new category: " + category.getName());
            }
        }
        
        if (addedCount > 0) {
            System.out.println("✅ " + addedCount + " new custom categories added.");
        } else {
            System.out.println("ℹ️ No new custom categories to add.");
        }
    }
    
    /**
     * Define default categories for initial setup
     * @return List of default categories
     */
    private List<Category> getDefaultCategories() {
        return Arrays.asList(
            new Category("Food", "Expenses related to groceries and dining out"),
            new Category("Transportation", "Expenses related to public transport, fuel, and vehicle maintenance"),
            new Category("Housing", "Rent, mortgage, and home maintenance expenses"),
            new Category("Utilities", "Electricity, water, internet, and other utility bills"),
            new Category("Entertainment", "Movies, games, and other leisure activities"),
            new Category("Healthcare", "Medical expenses, insurance, and medications"),
            new Category("Education", "Tuition, books, and other educational expenses"),
            new Category("Shopping", "Clothing, electronics, and other retail purchases"),
            new Category("Personal Care", "Haircuts, cosmetics, and other personal care items"),
            new Category("Miscellaneous", "Other expenses that don't fit into specific categories")
        );
    }
    
    /**
     * Define custom categories to be added on each startup
     * ADD NEW CATEGORIES HERE - they will be automatically added if they don't exist
     * @return List of custom categories
     */
    private List<Category> getCustomCategories() {
        return Arrays.asList(
            // Financial categories
            new Category("Travel", "Vacation, business trips, and travel-related expenses"),
            new Category("Insurance", "Life, health, auto, and property insurance premiums"),
            new Category("Savings & Investments", "Retirement contributions, stocks, and savings deposits"),
            new Category("Debt Payments", "Credit card payments, loan payments, and debt servicing"),
            
            // Lifestyle categories
            new Category("Gifts & Donations", "Charitable donations, gifts for family and friends"),
            new Category("Pet Care", "Veterinary bills, pet food, and pet supplies"),
            new Category("Subscriptions", "Streaming services, magazines, software subscriptions"),
            
            // Professional categories
            new Category("Business Expenses", "Work-related expenses, office supplies, professional development"),
            new Category("Taxes", "Income tax, property tax, and other tax payments"),
            new Category("Emergency Fund", "Emergency expenses and unexpected costs"),
            
            // Additional categories - ADD YOUR NEW CATEGORIES BELOW THIS LINE
            new Category("Fitness & Sports", "Gym memberships, sports equipment, and fitness activities"),
            new Category("Home Improvement", "Renovations, repairs, and home enhancement projects"),
            new Category("Technology", "Software, hardware, gadgets, and tech-related purchases"),
            new Category("Books & Media", "Books, audiobooks, movies, and educational content")
            
            // TO ADD MORE CATEGORIES: Simply add new Category objects here
            // Example: new Category("Your Category Name", "Description of the category")
        );
    }
}
