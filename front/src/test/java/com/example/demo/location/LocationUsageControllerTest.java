package com.example.demo.location;

import com.example.demo.location.dto.LocationUsageResponse;
import com.example.demo.reading.Reading;
import com.example.demo.reading.ReadingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LocationUsageControllerTest {

    @Mock
    private LocationRepository locationRepository;

    @Mock
    private ReadingRepository readingRepository;

    @InjectMocks
    private LocationUsageController controller;

    @Test
    void monthlyUsage_deveRetornarBadRequest_quandoMesInvalido() {
        ResponseEntity<?> resp = controller.monthlyUsage("loc1", 2025, 13);

        assertThat(resp.getStatusCode().value()).isEqualTo(400);
        assertThat(resp.getBody()).isEqualTo("month deve ser 1..12");

        verifyNoInteractions(locationRepository);
        verifyNoInteractions(readingRepository);
    }

    @Test
    void monthlyUsage_deveRetornarNotFound_quandoLocationNaoExiste() {
        when(locationRepository.findById("loc-inexistente"))
                .thenReturn(Optional.empty());

        ResponseEntity<?> resp = controller.monthlyUsage("loc-inexistente", 2025, 11);

        assertThat(resp.getStatusCode().value()).isEqualTo(404);
        verify(locationRepository).findById("loc-inexistente");
        verifyNoInteractions(readingRepository);
    }

    @Test
    void monthlyUsage_deveCalcularUsoMensal_quandoDadosValidos() {
        Location loc = new Location(
                "Banheiro Social",
                2,
                5.0,
                1000.0,
                LocationType.BATHROOM,
                1L,
                1L
        );
        when(locationRepository.findById("loc1"))
                .thenReturn(Optional.of(loc));


        LocalDate d1 = LocalDate.of(2025, 11, 1);
        LocalDate d2 = LocalDate.of(2025, 11, 15);
        LocalDate d3 = LocalDate.of(2025, 11, 30);

        Reading r1 = new Reading("loc1", d1, 300.0, 0.3, "manual", 1L);
        Reading r2 = new Reading("loc1", d2, 400.0, 0.4, "manual", 1L);
        Reading r3 = new Reading("loc1", d3, 500.0, 0.5, "manual", 1L);

        when(readingRepository
                .findByLocationIdAndDateBetweenOrderByDateAsc(
                        eq("loc1"),
                        any(LocalDate.class),
                        any(LocalDate.class)))
                .thenReturn(List.of(r1, r2, r3));

        ResponseEntity<?> resp = controller.monthlyUsage("loc1", 2025, 11);

        assertThat(resp.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(resp.getBody()).isInstanceOf(LocationUsageResponse.class);

        LocationUsageResponse body = (LocationUsageResponse) resp.getBody();
        assertThat(body.totalLiters()).isEqualTo(300.0 + 400.0 + 500.0);
        assertThat(body.totalM3()).isEqualTo(body.totalLiters() / 1000.0);
        assertThat(body.targetLitersPerMonth()).isEqualTo(1000.0);
        assertThat(body.ratioToTarget()).isEqualTo(body.totalLiters() / 1000.0);
        assertThat(body.year()).isEqualTo(2025);
        assertThat(body.month()).isEqualTo(11);
    }

    @Test
    void monthlyUsage_deveRetornarRatioNull_quandoTargetZero() {
        Location loc = new Location(
                "Área externa",
                0,
                10.0,
                0.0,
                LocationType.GARDEN,
                1L,
                1L
        );
        when(locationRepository.findById("loc2"))
                .thenReturn(Optional.of(loc));

        LocalDate d1 = LocalDate.of(2025, 11, 10);
        Reading r1 = new Reading("loc2", d1, 200.0, 0.2, "manual", 1L);

        when(readingRepository
                .findByLocationIdAndDateBetweenOrderByDateAsc(
                        eq("loc2"),
                        any(LocalDate.class),
                        any(LocalDate.class)))
                .thenReturn(List.of(r1));

        ResponseEntity<?> resp = controller.monthlyUsage("loc2", 2025, 11);

        assertThat(resp.getStatusCode().is2xxSuccessful()).isTrue();
        LocationUsageResponse body = (LocationUsageResponse) resp.getBody();

        assertThat(body.targetLitersPerMonth()).isEqualTo(0.0);
        assertThat(body.ratioToTarget()).isNull();
    }
}
