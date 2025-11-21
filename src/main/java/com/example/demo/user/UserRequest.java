package com.example.demo.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class UserRequest {

    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String role;

    public String getName() { return name; }

    public String getEmail() { return email; }

    public String getPassword() { return password; }

    public String getRole() { return role; }
}
