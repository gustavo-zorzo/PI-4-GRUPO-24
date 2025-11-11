package com.example.demo.location;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LocationRepository extends MongoRepository<Location, String> {
    Page<Location> findByNameContainingIgnoreCase(String q, Pageable pageable);
    boolean existsByNameIgnoreCase(String name);
}
