package com.example.demo.reading;

import java.time.Instant;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import com.example.demo.location.LocationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/readings")
public class ReadingController {

    private final ReadingRepository repository;
    private final LocationRepository locationRepository;

    public ReadingController(ReadingRepository repository,
                             LocationRepository locationRepository) {
        this.repository = repository;
        this.locationRepository = locationRepository;
    }

    @PostMapping
    public ResponseEntity<?> create(@Validated @RequestBody ReadingRequest req) {
        // valida locationId
        if (req.getLocationId() == null || req.getLocationId().isBlank()
                || !locationRepository.existsById(req.getLocationId())) {
            return ResponseEntity.badRequest().body("locationId inválido ou não encontrado.");
        }

        // pelo menos um dos volumes > 0
        if ((req.getVolumeLiters() == null || req.getVolumeLiters() <= 0)
                && (req.getVolumeM3() == null || req.getVolumeM3() <= 0)) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Informe volumeLiters (>0) ou volumeM3 (>0).");
            return ResponseEntity.badRequest().body(err);
        }

        Double liters = req.getVolumeLiters();
        Double m3 = req.getVolumeM3();

        // conversões
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

    @GetMapping
    public ResponseEntity<?> list(
            @RequestParam String locationId,
            @RequestParam LocalDate start,
            @RequestParam LocalDate end
    ) {
        if (end.isBefore(start)) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "O parâmetro 'end' não pode ser anterior a 'start'.");
            return ResponseEntity.badRequest().body(err);
        }

        var list = repository.findByLocationIdAndDateBetweenOrderByDateAsc(locationId, start, end);
        return ResponseEntity.ok(list);
    }
}
