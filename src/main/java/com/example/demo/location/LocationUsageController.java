package com.example.demo.location;

import com.example.demo.location.dto.LocationUsageResponse;
import com.example.demo.reading.ReadingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;

@RestController
@RequestMapping("/api/locations")
public class LocationUsageController {

    private final LocationRepository locationRepository;
    private final ReadingRepository readingRepository;

    public LocationUsageController(LocationRepository locationRepository,
                                   ReadingRepository readingRepository) {
        this.locationRepository = locationRepository;
        this.readingRepository = readingRepository;
    }

    // GET /api/locations/{id}/usage?year=2025&month=11
    @GetMapping("/{id}/usage")
    public ResponseEntity<?> monthlyUsage(@PathVariable("id") String locationId,
                                          @RequestParam int year,
                                          @RequestParam int month) {

        var optLoc = locationRepository.findById(locationId);
        if (optLoc.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var loc = optLoc.get();

        if (month < 1 || month > 12) {
            return ResponseEntity.badRequest().body("month deve ser 1..12");
        }

        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        var readings = readingRepository
                .findByLocationIdAndDateBetweenOrderByDateAsc(locationId, start, end);

        double totalLiters = readings.stream()
                .filter(r -> r.getVolumeLiters() != null)
                .mapToDouble(r -> r.getVolumeLiters())
                .sum();

        double totalM3 = totalLiters / 1000.0;
        double target = loc.getConsumptionTargetLitersPerMonth() != null
                ? loc.getConsumptionTargetLitersPerMonth() : 0.0;
        Double ratio = (target > 0) ? (totalLiters / target) : null;

        var resp = new LocationUsageResponse(
                locationId,
                year,
                month,
                start.toString(),
                end.toString(),
                readings.size(),
                totalLiters,
                totalM3,
                target,
                ratio
        );

        return ResponseEntity.ok(resp);
    }
}
