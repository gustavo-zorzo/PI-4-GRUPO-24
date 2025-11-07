package com.example.demo.reading;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ReadingRequest {

    @NotNull
    private String locationId;

    @NotNull
    private LocalDate date; // ISO yyyy-MM-dd

    // Pelo menos um dos dois deve estar presente e > 0
    @Positive(message = "volumeLiters deve ser > 0")
    private Double volumeLiters;

    @Positive(message = "volumeM3 deve ser > 0")
    private Double volumeM3;

    public String getLocationId() { return locationId; }
    public void setLocationId(String locationId) { this.locationId = locationId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Double getVolumeLiters() { return volumeLiters; }
    public void setVolumeLiters(Double volumeLiters) { this.volumeLiters = volumeLiters; }

    public Double getVolumeM3() { return volumeM3; }
    public void setVolumeM3(Double volumeM3) { this.volumeM3 = volumeM3; }
}
