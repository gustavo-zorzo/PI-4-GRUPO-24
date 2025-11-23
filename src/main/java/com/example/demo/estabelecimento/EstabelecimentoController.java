package com.example.demo.estabelecimento;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/estabelecimentos")
public class EstabelecimentoController {

    private final EstabelecimentoRepository repository;

    public EstabelecimentoController(EstabelecimentoRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody @Valid EstabelecimentoRequest req, @RequestParam(required = false) String ownerId, @RequestParam(required = false) String ownerEmail) {
        Estabelecimento e = new Estabelecimento();
        e.setTipoImovel(req.getTipoImovel());
        e.setNomeEstabelecimento(req.getNomeEstabelecimento());

        e.setRua(req.getRua());
        e.setNumero(req.getNumero());
        e.setBairro(req.getBairro());
        e.setCidade(req.getCidade());
        e.setEstado(req.getEstado());
        e.setCep(req.getCep());

        e.setPessoasQueUsam(req.getPessoasQueUsam());
        e.setHidrometroIndividual(req.getHidrometroIndividual());
        e.setConsumoMedioMensalLitros(req.getConsumoMedioMensalLitros());
        e.setTemCaixaDagua(req.getTemCaixaDagua());
        e.setCapacidadeCaixaLitros(req.getCapacidadeCaixaLitros());

        e.setReceberAlertas(req.getReceberAlertas());
        e.setLimiteMaxDiarioLitros(req.getLimiteMaxDiarioLitros());
        e.setVerGraficos(req.getVerGraficos());

        e.setOwnerId(ownerId);
        e.setOwnerEmail(ownerEmail);

        long now = Instant.now().toEpochMilli();
        e.setCreatedAtEpochMs(now);
        e.setUpdatedAtEpochMs(now);

        Estabelecimento saved = repository.save(e);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<?> listByOwner(@RequestParam(required = false) String ownerId, @RequestParam(required = false) String ownerEmail) {
        if (ownerId != null) {
            List<Estabelecimento> list = repository.findByOwnerId(ownerId);
            return ResponseEntity.ok(list);
        }
        if (ownerEmail != null) {
            List<Estabelecimento> list = repository.findByOwnerEmailIgnoreCase(ownerEmail);
            return ResponseEntity.ok(list);
        }
        return ResponseEntity.badRequest().body(Map.of("error", "ownerId or ownerEmail required"));
    }
}
