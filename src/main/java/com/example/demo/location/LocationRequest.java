package com.example.demo.location.dto;

import com.example.demo.location.LocationType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class LocationRequest {

    @NotBlank
    private String name;

    @Min(0)
    private Integer occupants;

    @Min(0)
    private Double areaM2;

    @NotNull @Min(0)
    private Double consumptionTargetLitersPerMonth;

    @NotNull
    private LocationType type;

    public String getName() { return name; }
    public Integer getOccupants() { return occupants; }
    public Double getAreaM2() { return areaM2; }
    public Double getConsumptionTargetLitersPerMonth() { return consumptionTargetLitersPerMonth; }
    public LocationType getType() { return type; }
}
