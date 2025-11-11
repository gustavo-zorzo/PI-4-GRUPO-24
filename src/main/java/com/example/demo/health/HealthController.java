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
    public ResponseEntity<?> health() {

        Map<String, Object> body = new HashMap<>();
        body.put("status", "UP");
        body.put("time", OffsetDateTime.now().toString());

        try {
            // Executa o ping
            var res = mongoTemplate.executeCommand("{ ping: 1 }");

            // Lê o campo "ok" de forma segura (Integer ou Double)
            Object okVal = (res != null) ? res.get("ok") : null;
            boolean ok = false;

            if (okVal instanceof Number n) {
                ok = n.doubleValue() == 1.0d;
            } else if (okVal != null) {
                ok = "1".equals(okVal.toString());
            }

            body.put("mongo", ok ? "OK" : "FAIL");

        } catch (Exception e) {

            body.put("mongo", "FAIL");
            body.put("errorClass", e.getClass().getName());
            body.put("error", e.getMessage());

            if (e.getCause() != null) {
                body.put("causeClass", e.getCause().getClass().getName());
                body.put("cause", e.getCause().getMessage());
            }
        }

        return ResponseEntity.ok(body);
    }
}
