package com.example.demo.user;

public class UserResponse {

    private String id;
    private String name;
    private String email;
    private String role;
    private Long createdAtEpochMs;
    private Long updatedAtEpochMs;

    public static UserResponse from(User u) {
        UserResponse r = new UserResponse();
        r.id = u.getId();
        r.name = u.getName();
        r.email = u.getEmail();
        r.role = u.getRole();
        r.createdAtEpochMs = u.getCreatedAtEpochMs();
        r.updatedAtEpochMs = u.getUpdatedAtEpochMs();
        return r;
    }

    public String getId() { return id; }

    public String getName() { return name; }

    public String getEmail() { return email; }

    public String getRole() { return role; }

    public Long getCreatedAtEpochMs() { return createdAtEpochMs; }

    public Long getUpdatedAtEpochMs() { return updatedAtEpochMs; }
}
