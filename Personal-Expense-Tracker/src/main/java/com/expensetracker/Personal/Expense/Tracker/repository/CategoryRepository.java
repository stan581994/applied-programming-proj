package com.expensetracker.Personal.Expense.Tracker.repository;

import com.expensetracker.Personal.Expense.Tracker.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Custom query methods can be added here if needed
}
