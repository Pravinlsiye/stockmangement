package com.supermarket.stockmanagement.service;

import com.supermarket.stockmanagement.model.Category;
import com.supermarket.stockmanagement.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    public Optional<Category> getCategoryById(String id) {
        return categoryRepository.findById(id);
    }
    
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }
    
    public Category updateCategory(String id, Category category) {
        category.setId(id);
        return categoryRepository.save(category);
    }
    
    public void deleteCategory(String id) {
        categoryRepository.deleteById(id);
    }
}
