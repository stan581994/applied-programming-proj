package com.expensetracker.Personal.Expense.Tracker.repository;

import com.expensetracker.Personal.Expense.Tracker.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    // Find expenses by category id
    List<Expense> findByCategoryId(Long categoryId);
    
    // Find expenses between two dates
    List<Expense> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    // Find expenses by category id and between two dates
    List<Expense> findByCategoryIdAndDateBetween(Long categoryId, LocalDate startDate, LocalDate endDate);
    
    // Custom query to get sum of expenses by category
    @Query("SELECT e.category.id, e.category.name, SUM(e.amount) FROM Expense e GROUP BY e.category.id, e.category.name")
    List<Object[]> sumExpensesByCategory();
}
