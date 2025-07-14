package com.expensetracker.Personal.Expense.Tracker.service;

import com.expensetracker.Personal.Expense.Tracker.Expense;
import com.expensetracker.Personal.Expense.Tracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {
    
    private final ExpenseRepository expenseRepository;
    
    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }
    
    public List<Expense> findAllExpenses() {
        return expenseRepository.findAll();
    }
    
    public Optional<Expense> findExpenseById(Long id) {
        return expenseRepository.findById(id);
    }
    
    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }
    
    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
    
    public List<Expense> findExpensesByCategory(Long categoryId) {
        return expenseRepository.findByCategoryId(categoryId);
    }
    
    public List<Expense> findExpensesByDateRange(LocalDate startDate, LocalDate endDate) {
        return expenseRepository.findByDateBetween(startDate, endDate);
    }
    
    public List<Expense> findExpensesByCategoryAndDateRange(Long categoryId, LocalDate startDate, LocalDate endDate) {
        return expenseRepository.findByCategoryIdAndDateBetween(categoryId, startDate, endDate);
    }
    
    public List<Object[]> getExpenseSummaryByCategory() {
        return expenseRepository.sumExpensesByCategory();
    }
    
    public BigDecimal calculateTotalExpenses() {
        return expenseRepository.findAll().stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
