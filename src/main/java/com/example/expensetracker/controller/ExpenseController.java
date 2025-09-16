package com.example.expensetracker.controller;

import com.example.expensetracker.models.Expense;
import com.example.expensetracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService service;

    // CREATE
    @PostMapping
    public ResponseEntity<String> addExpense(@RequestBody Expense expense,
                                             @RequestParam Long userId) {
        service.addExpense(userId, expense);
        return ResponseEntity.ok("Expense added successfully!");
    }

    // READ
    @GetMapping
    public List<Expense> getAllExpenses(@RequestParam Long userId) {
        return service.getExpenses(userId);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<String> updateExpense(@PathVariable Long id,
                                                @RequestBody Expense expense,
                                                @RequestParam Long userId) {
        service.updateExpense(userId, id, expense);
        return ResponseEntity.ok("Expense updated successfully!");
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(@PathVariable Long id,
                                                @RequestParam Long userId) {
        service.deleteExpense(id, userId);
        return ResponseEntity.ok("Expense deleted successfully!");
    }
}