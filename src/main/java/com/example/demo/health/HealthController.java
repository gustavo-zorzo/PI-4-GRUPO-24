package com.example.demo.health;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> body = new HashMap<>();
        body.put("status", "UP");
        body.put("time", OffsetDateTime.now().toString());
        try {
            var res = mongoTemplate.executeCommand("{ ping: 1 }");
            var ok = res != null && Double.valueOf(1.0).equals(res.getDouble("ok"));
            body.put("mongo", ok ? "OK" : "FAIL");
        } catch (Exception e) {
            body.put("mongo", "FAIL");
            body.put("error", e.getMessage());
        }
        return ResponseEntity.ok(body);
    }
}
