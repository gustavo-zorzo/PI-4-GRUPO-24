package com.example.demo.user;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    @NotBlank
    private String name;

    @NotBlank
    @Email
    @Indexed(unique = true)
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String role;

    private Long createdAtEpochMs;
    private Long updatedAtEpochMs;

    public User() {
    }

    public User(
            String id,
            String name,
            String email,
            String password,
            String role,
            Long createdAtEpochMs,
            Long updatedAtEpochMs
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAtEpochMs = createdAtEpochMs;
        this.updatedAtEpochMs = updatedAtEpochMs;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getCreatedAtEpochMs() { return createdAtEpochMs; }
    public void setCreatedAtEpochMs(Long createdAtEpochMs) { this.createdAtEpochMs = createdAtEpochMs; }

    public Long getUpdatedAtEpochMs() { return updatedAtEpochMs; }
    public void setUpdatedAtEpochMs(Long updatedAtEpochMs) { this.updatedAtEpochMs = updatedAtEpochMs; }
}
