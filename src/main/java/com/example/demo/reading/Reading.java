package com.example.demo.reading;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "readings")
public class Reading {

    @Id
    private String id;

    private String locationId;     // por enquanto string simples; depois criamos Location
    private LocalDate date;        // data da leitura (dia)

    private Double volumeLiters;   // litros do dia
    private Double volumeM3;       // m³ do dia (mantemos por conveniência)

    private String source;         // "manual" | "sensor" (por enquanto "manual")
    private Long createdAtEpochMs; // quando foi salvo (epoch ms)

    public Reading() {}

    public Reading(String locationId, LocalDate date, Double volumeLiters, Double volumeM3, String source, Long createdAtEpochMs) {
        this.locationId = locationId;
        this.date = date;
        this.volumeLiters = volumeLiters;
        this.volumeM3 = volumeM3;
        this.source = source;
        this.createdAtEpochMs = createdAtEpochMs;
    }

    public String getId() { return id; }
    public String getLocationId() { return locationId; }
    public void setLocationId(String locationId) { this.locationId = locationId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Double getVolumeLiters() { return volumeLiters; }
    public void setVolumeLiters(Double volumeLiters) { this.volumeLiters = volumeLiters; }

    public Double getVolumeM3() { return volumeM3; }
    public void setVolumeM3(Double volumeM3) { this.volumeM3 = volumeM3; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public Long getCreatedAtEpochMs() { return createdAtEpochMs; }
    public void setCreatedAtEpochMs(Long createdAtEpochMs) { this.createdAtEpochMs = createdAtEpochMs; }
}
