package com.example.expensetracker.repository;

import com.example.expensetracker.models.Expense;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ExpenseRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // CREATE (with userId)
    public int addExpense(Long userId, Expense expense) {
        String sql = "INSERT INTO expenses(title, amount, category, date, user_id) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                expense.getTitle(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getDate(),
                userId);
    }

    // READ (only user-specific expenses)
    public List<Expense> getAllExpenses(Long userId) {
        String sql = "SELECT * FROM expenses WHERE user_id = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Expense.class), userId);
    }

    // UPDATE (make sure only user can update their own expense)
    public int updateExpense(Long userId, Long id, Expense expense) {
        String sql = "UPDATE expenses SET title = ?, amount = ?, category = ?, date = ? WHERE id = ? AND user_id = ?";
        return jdbcTemplate.update(sql,
                expense.getTitle(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getDate(),
                id,
                userId);
    }

    // DELETE (user-specific)
    public int deleteExpense(Long id, Long userId) {
        String sql = "DELETE FROM expenses WHERE id = ? AND user_id = ?";
        return jdbcTemplate.update(sql, id, userId);
    }
}
