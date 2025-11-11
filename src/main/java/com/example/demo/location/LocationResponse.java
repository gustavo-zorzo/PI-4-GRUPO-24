package com.example.demo.location;

public class LocationResponse {

    private String id;
    private String name;
    private Integer occupants;
    private Double areaM2;
    private Double consumptionTargetLitersPerMonth;
    private LocationType type;
    private Long createdAtEpochMs;
    private Long updatedAtEpochMs;

    public static LocationResponse from(Location l) {
        LocationResponse r = new LocationResponse();
        r.id = l.getId();
        r.name = l.getName();
        r.occupants = l.getOccupants();
        r.areaM2 = l.getAreaM2();
        r.consumptionTargetLitersPerMonth = l.getConsumptionTargetLitersPerMonth();
        r.type = l.getType();
        r.createdAtEpochMs = l.getCreatedAtEpochMs();
        r.updatedAtEpochMs = l.getUpdatedAtEpochMs();
        return r;
    }

    public String getId() { return id; }
    
    public String getName() { return name; }

    public Integer getOccupants() { return occupants; }

    public Double getAreaM2() { return areaM2; }

    public Double getConsumptionTargetLitersPerMonth() { return consumptionTargetLitersPerMonth; }

    public LocationType getType() { return type; }

    public Long getCreatedAtEpochMs() { return createdAtEpochMs; }

    public Long getUpdatedAtEpochMs() { return updatedAtEpochMs; }
}
