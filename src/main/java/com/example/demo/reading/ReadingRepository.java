package com.example.demo.reading;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReadingRepository extends MongoRepository<Reading, String> {

    // Usado pelo GET /api/readings
    List<Reading> findByLocationIdAndDateBetweenOrderByDateAsc(
            String locationId,
            LocalDate start,
            LocalDate end
    );
}
