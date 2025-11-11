package com.example.demo.location.dto;

public class LocationUsageResponse {
    private String locationId;
    private int year;
    private int month;              // 1..12
    private String periodStart;     // ISO (yyyy-MM-dd)
    private String periodEnd;       // ISO (yyyy-MM-dd)
    private long readingsCount;
    private double totalLiters;
    private double totalM3;
    private double targetLitersPerMonth;
    private Double ratio;           // totalLiters / target (null se target == 0)

    public LocationUsageResponse(String locationId, int year, int month,
                                 String periodStart, String periodEnd,
                                 long readingsCount, double totalLiters, double totalM3,
                                 double targetLitersPerMonth, Double ratio) {
        this.locationId = locationId;
        this.year = year;
        this.month = month;
        this.periodStart = periodStart;
        this.periodEnd = periodEnd;
        this.readingsCount = readingsCount;
        this.totalLiters = totalLiters;
        this.totalM3 = totalM3;
        this.targetLitersPerMonth = targetLitersPerMonth;
        this.ratio = ratio;
    }

    public String getLocationId() { return locationId; }
    public int getYear() { return year; }
    public int getMonth() { return month; }
    public String getPeriodStart() { return periodStart; }
    public String getPeriodEnd() { return periodEnd; }
    public long getReadingsCount() { return readingsCount; }
    public double getTotalLiters() { return totalLiters; }
    public double getTotalM3() { return totalM3; }
    public double getTargetLitersPerMonth() { return targetLitersPerMonth; }
    public Double getRatio() { return ratio; }
}
