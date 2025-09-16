package com.example.expensetracker.service;

import com.example.expensetracker.models.User;
import com.example.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repository;

    @Autowired
    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public void register(User user) {
        repository.save(user);
    }

    public User login(String username, String password) {
        return repository.findByUsernameAndPassword(username, password);
    }
}
