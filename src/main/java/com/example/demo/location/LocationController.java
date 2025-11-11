package com.example.demo.location;

// Update the import path if LocationRequest is in a different package
import jakarta.validation.Valid;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationRepository repo;

    public LocationController(LocationRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody LocationRequest req) {
        try {
            var now = System.currentTimeMillis();

            Location loc = new Location(
                req.getName(),
                req.getOccupants(),
                req.getAreaM2(),
                req.getConsumptionTargetLitersPerMonth(),
                req.getType(),
                now,
                now
            );

            return ResponseEntity.ok(LocationResponse.from(repo.save(loc)));

        } catch (DuplicateKeyException e) {
            return ResponseEntity.status(409).body("Já existe um local com esse nome.");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> find(@PathVariable String id) {
        return repo.findById(id)
            .map(LocationResponse::from)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
