package com.example.demo.location.dto;

import com.example.demo.location.Location;
import com.example.demo.location.LocationType;

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
}
