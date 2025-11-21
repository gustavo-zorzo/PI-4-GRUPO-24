package com.example.demo.user;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository repository;

    public UserController(UserRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody @Valid UserRequest req) {
        if (repository.existsByEmailIgnoreCase(req.getEmail())) {
            return ResponseEntity
                    .status(409)
                    .body(Map.of("error", "Já existe um usuário com esse e-mail."));
        }

        long now = Instant.now().toEpochMilli();

        User u = new User();
        u.setName(req.getName());
        u.setEmail(req.getEmail());
        u.setPassword(req.getPassword());
        u.setRole(req.getRole());
        u.setCreatedAtEpochMs(now);
        u.setUpdatedAtEpochMs(now);

        u = repository.save(u);
        return ResponseEntity.ok(UserResponse.from(u));
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> listAll() {
        List<UserResponse> list = repository.findAll()
                .stream()
                .map(UserResponse::from)
                .toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable String id) {
        return repository.findById(id)
                .map(UserResponse::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable String id,
            @RequestBody @Valid UserRequest req
    ) {
        return repository.findById(id)
                .map(existing -> {
                    if (!existing.getEmail().equalsIgnoreCase(req.getEmail())
                            && repository.existsByEmailIgnoreCase(req.getEmail())) {
                        return ResponseEntity
                                .status(409)
                                .body(Map.of("error", "Já existe um usuário com esse e-mail."));
                    }

                    existing.setName(req.getName());
                    existing.setEmail(req.getEmail());
                    existing.setPassword(req.getPassword());
                    existing.setRole(req.getRole());
                    existing.setUpdatedAtEpochMs(Instant.now().toEpochMilli());

                    User saved = repository.save(existing);
                    return ResponseEntity.ok(UserResponse.from(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        return repository.findById(id)
                .map(u -> {
                    repository.delete(u);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest req) {
        return repository.findByEmailIgnoreCase(req.getEmail())
                .map(u -> {
                    if (u.getPassword().equals(req.getPassword())) {
                        return ResponseEntity.ok(UserResponse.from(u));
                    } else {
                        return ResponseEntity
                                .status(401)
                                .body(Map.of("error", "Credenciais inválidas."));
                    }
                })
                .orElse(
                        ResponseEntity
                                .status(401)
                                .body(Map.of("error", "Credenciais inválidas."))
                );
    }
}
