package com.example.demo.reading;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReadingRepository extends MongoRepository<Reading, String> {
    List<Reading> findByLocationIdAndDateBetween(String locationId, LocalDate start, LocalDate end);
    List<Reading> findByLocationIdAndDate(String locationId, LocalDate date);
}
