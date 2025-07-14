package com.expensetracker.Personal.Expense.Tracker.controller;

import com.expensetracker.Personal.Expense.Tracker.Expense;
import com.expensetracker.Personal.Expense.Tracker.service.CategoryService;
import com.expensetracker.Personal.Expense.Tracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.time.LocalDate;

@Controller
@RequestMapping("/expenses")
public class ExpenseController {
    
    private final ExpenseService expenseService;
    private final CategoryService categoryService;
    
    @Autowired
    public ExpenseController(ExpenseService expenseService, CategoryService categoryService) {
        this.expenseService = expenseService;
        this.categoryService = categoryService;
    }
    
    @GetMapping
    public String listExpenses(Model model) {
        model.addAttribute("expenses", expenseService.findAllExpenses());
        model.addAttribute("expense", new Expense());
        model.addAttribute("categories", categoryService.findAllCategories());
        model.addAttribute("totalExpenses", expenseService.calculateTotalExpenses());
        return "expenses";
    }
    
    @PostMapping
    public String saveExpense(@ModelAttribute Expense expense, RedirectAttributes redirectAttributes) {
        expenseService.saveExpense(expense);
        redirectAttributes.addFlashAttribute("message", "Expense saved successfully!");
        return "redirect:/expenses";
    }
    
    @GetMapping("/edit/{id}")
    public String editExpenseForm(@PathVariable Long id, Model model) {
        model.addAttribute("expense", expenseService.findExpenseById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid expense ID: " + id)));
        model.addAttribute("expenses", expenseService.findAllExpenses());
        model.addAttribute("categories", categoryService.findAllCategories());
        model.addAttribute("totalExpenses", expenseService.calculateTotalExpenses());
        return "expenses";
    }
    
    @GetMapping("/delete/{id}")
    public String deleteExpense(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        expenseService.deleteExpense(id);
        redirectAttributes.addFlashAttribute("message", "Expense deleted successfully!");
        return "redirect:/expenses";
    }
    
    @GetMapping("/filter")
    public String filterExpenses(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Model model) {
        
        if (categoryId != null && startDate != null && endDate != null) {
            model.addAttribute("expenses", expenseService.findExpensesByCategoryAndDateRange(categoryId, startDate, endDate));
        } else if (categoryId != null) {
            model.addAttribute("expenses", expenseService.findExpensesByCategory(categoryId));
        } else if (startDate != null && endDate != null) {
            model.addAttribute("expenses", expenseService.findExpensesByDateRange(startDate, endDate));
        } else {
            model.addAttribute("expenses", expenseService.findAllExpenses());
        }
        
        model.addAttribute("expense", new Expense());
        model.addAttribute("categories", categoryService.findAllCategories());
        model.addAttribute("totalExpenses", expenseService.calculateTotalExpenses());
        model.addAttribute("selectedCategoryId", categoryId);
        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);
        
        return "expenses";
    }
    
    @GetMapping("/summary")
    public String showExpenseSummary(Model model) {
        model.addAttribute("categorySummary", expenseService.getExpenseSummaryByCategory());
        model.addAttribute("totalExpenses", expenseService.calculateTotalExpenses());
        return "summary";
    }
}
