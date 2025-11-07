package com.example.demo.reading;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/readings")
public class ReadingController {

    private final ReadingRepository repository;

    public ReadingController(ReadingRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<?> create(@Validated @RequestBody ReadingRequest req) {
        // Pelo menos um volume precisa existir
        if ((req.getVolumeLiters() == null || req.getVolumeLiters() <= 0) &&
            (req.getVolumeM3() == null || req.getVolumeM3() <= 0)) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Informe volumeLiters (>0) ou volumeM3 (>0).");
            return ResponseEntity.badRequest().body(err);
        }

        // Converter para manter ambos os campos
        Double liters = req.getVolumeLiters();
        Double m3 = req.getVolumeM3();

        if (liters == null && m3 != null) {
            liters = m3 * 1000.0;
        } else if (m3 == null && liters != null) {
            m3 = liters / 1000.0;
        }

        Reading reading = new Reading(
            req.getLocationId(),
            req.getDate(),
            liters,
            m3,
            "manual",
            Instant.now().toEpochMilli()
        );

        Reading saved = repository.save(reading);
        return ResponseEntity.ok(saved);
    }
}
