package com.example.demo.reading;

import com.example.demo.location.LocationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReadingControllerTest {

    @Mock
    private ReadingRepository readingRepository;

    @Mock
    private LocationRepository locationRepository;

    @InjectMocks
    private ReadingController controller;

    @Test
    void create_deveRetornarBadRequest_quandoLocationInvalida() {
        ReadingRequest req = new ReadingRequest();
        req.setLocationId("loc-invalida");
        req.setDate(LocalDate.of(2025, 11, 1));
        req.setVolumeLiters(100.0);

        when(locationRepository.existsById("loc-invalida")).thenReturn(false);

        ResponseEntity<?> resp = controller.create(req);

        assertThat(resp.getStatusCode().value()).isEqualTo(400);
        assertThat(resp.getBody())
                .isEqualTo("locationId inválido ou não encontrado.");

        verifyNoInteractions(readingRepository);
    }

    @Test
    void create_deveRetornarBadRequest_quandoVolumesInvalidos() {
        ReadingRequest req = new ReadingRequest();
        req.setLocationId("loc1");
        req.setDate(LocalDate.of(2025, 11, 1));
        req.setVolumeLiters(0.0);
        req.setVolumeM3(0.0);

        when(locationRepository.existsById("loc1")).thenReturn(true);

        ResponseEntity<?> resp = controller.create(req);

        assertThat(resp.getStatusCode().value()).isEqualTo(400);
        assertThat(resp.getBody()).isInstanceOf(Map.class);
        Map<?,?> body = (Map<?,?>) resp.getBody();
        assertThat(body.get("error"))
                .isEqualTo("Informe volumeLiters (>0) ou volumeM3 (>0).");

        verifyNoInteractions(readingRepository);
    }

    @Test
    void create_deveConverterLitrosParaM3_quandoSomenteLitrosInformado() {
        ReadingRequest req = new ReadingRequest();
        req.setLocationId("loc1");
        req.setDate(LocalDate.of(2025, 11, 1));
        req.setVolumeLiters(1500.0);
        req.setVolumeM3(null);

        when(locationRepository.existsById("loc1")).thenReturn(true);

        Reading saved = new Reading();
        when(readingRepository.save(any(Reading.class))).thenReturn(saved);

        ResponseEntity<?> resp = controller.create(req);

        assertThat(resp.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(resp.getBody()).isSameAs(saved);

        ArgumentCaptor<Reading> captor = ArgumentCaptor.forClass(Reading.class);
        verify(readingRepository).save(captor.capture());

        Reading persisted = captor.getValue();
        assertThat(persisted.getVolumeLiters()).isEqualTo(1500.0);
        assertThat(persisted.getVolumeM3()).isEqualTo(1.5);
    }

    @Test
    void create_deveConverterM3ParaLitros_quandoSomenteM3Informado() {
        ReadingRequest req = new ReadingRequest();
        req.setLocationId("loc1");
        req.setDate(LocalDate.of(2025, 11, 1));
        req.setVolumeLiters(null);
        req.setVolumeM3(2.0);

        when(locationRepository.existsById("loc1")).thenReturn(true);

        Reading saved = new Reading();
        when(readingRepository.save(any(Reading.class))).thenReturn(saved);

        ResponseEntity<?> resp = controller.create(req);

        assertThat(resp.getStatusCode().is2xxSuccessful()).isTrue();

        ArgumentCaptor<Reading> captor = ArgumentCaptor.forClass(Reading.class);
        verify(readingRepository).save(captor.capture());

        Reading persisted = captor.getValue();
        assertThat(persisted.getVolumeM3()).isEqualTo(2.0);
        assertThat(persisted.getVolumeLiters()).isEqualTo(2000.0);
    }

    @Test
    void list_deveRetornarBadRequest_quandoEndAntesDeStart() {
        String locationId = "loc1";
        LocalDate start = LocalDate.of(2025, 11, 10);
        LocalDate end = LocalDate.of(2025, 11, 1); // anterior

        ResponseEntity<?> resp = controller.list(locationId, start, end);

        assertThat(resp.getStatusCode().value()).isEqualTo(400);
        Map<?,?> body = (Map<?,?>) resp.getBody();
        assertThat(body.get("error"))
                .isEqualTo("O parâmetro 'end' não pode ser anterior a 'start'.");

        verifyNoInteractions(readingRepository);
    }
}
