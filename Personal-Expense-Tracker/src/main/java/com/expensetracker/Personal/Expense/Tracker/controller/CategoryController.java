package com.expensetracker.Personal.Expense.Tracker.controller;

import com.expensetracker.Personal.Expense.Tracker.Category;
import com.expensetracker.Personal.Expense.Tracker.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/categories")
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }
    
    @GetMapping
    public String listCategories(Model model) {
        model.addAttribute("categories", categoryService.findAllCategories());
        model.addAttribute("category", new Category());
        return "categories";
    }
    
    @PostMapping
    public String saveCategory(@ModelAttribute Category category, RedirectAttributes redirectAttributes) {
        categoryService.saveCategory(category);
        redirectAttributes.addFlashAttribute("message", "Category saved successfully!");
        return "redirect:/categories";
    }
    
    @GetMapping("/edit/{id}")
    public String editCategoryForm(@PathVariable Long id, Model model) {
        model.addAttribute("category", categoryService.findCategoryById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid category ID: " + id)));
        model.addAttribute("categories", categoryService.findAllCategories());
        return "categories";
    }
    
    @GetMapping("/delete/{id}")
    public String deleteCategory(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            categoryService.deleteCategory(id);
            redirectAttributes.addFlashAttribute("message", "Category deleted successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Cannot delete category. It may be used by expenses.");
        }
        return "redirect:/categories";
    }
}
