package com.example.demo.location;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Document(collection = "locations")
public class Location {

    @Id
    private String id;

    @Indexed(unique = true)
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

    private Long createdAtEpochMs;
    private Long updatedAtEpochMs;

    public Location() {}

    public Location(String name, Integer occupants, Double areaM2,
                    Double target, LocationType type,
                    Long createdAt, Long updatedAt) {

        this.name = name;
        this.occupants = occupants;
        this.areaM2 = areaM2;
        this.consumptionTargetLitersPerMonth = target;
        this.type = type;
        this.createdAtEpochMs = createdAt;
        this.updatedAtEpochMs = updatedAt;
    }

    // getters & setters
    public String getId() { return id; }
    public String getName() { return name; }
    public Integer getOccupants() { return occupants; }
    public Double getAreaM2() { return areaM2; }
    public Double getConsumptionTargetLitersPerMonth() { return consumptionTargetLitersPerMonth; }
    public LocationType getType() { return type; }

    public Long getCreatedAtEpochMs() { return createdAtEpochMs; }
    public Long getUpdatedAtEpochMs() { return updatedAtEpochMs; }

    public void setName(String name) { this.name = name; }
    public void setOccupants(Integer o) { this.occupants = o; }
    public void setAreaM2(Double a) { this.areaM2 = a; }
    public void setConsumptionTargetLitersPerMonth(Double t) { this.consumptionTargetLitersPerMonth = t; }
    public void setType(LocationType type) { this.type = type; }
    public void setUpdatedAtEpochMs(Long t) { this.updatedAtEpochMs = t; }
}
