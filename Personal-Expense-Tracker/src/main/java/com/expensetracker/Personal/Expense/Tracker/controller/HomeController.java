package com.expensetracker.Personal.Expense.Tracker.controller;

import com.expensetracker.Personal.Expense.Tracker.service.CategoryService;
import com.expensetracker.Personal.Expense.Tracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    
    private final ExpenseService expenseService;
    private final CategoryService categoryService;
    
    @Autowired
    public HomeController(ExpenseService expenseService, CategoryService categoryService) {
        this.expenseService = expenseService;
        this.categoryService = categoryService;
    }
    
    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("totalExpenses", expenseService.calculateTotalExpenses());
        model.addAttribute("expenseCount", expenseService.findAllExpenses().size());
        model.addAttribute("categoryCount", categoryService.findAllCategories().size());
        model.addAttribute("categorySummary", expenseService.getExpenseSummaryByCategory());
        return "index";
    }
}
