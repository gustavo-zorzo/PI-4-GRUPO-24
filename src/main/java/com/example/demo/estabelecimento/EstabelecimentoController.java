package com.example.demo.estabelecimento;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;
import java.util.ArrayList;

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

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody @Valid EstabelecimentoRequest req, @RequestParam(required = false) String ownerId, @RequestParam(required = false) String ownerEmail) {
        Optional<Estabelecimento> maybe = repository.findById(id);
        if (maybe.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Estabelecimento não encontrado"));
        }

        Estabelecimento e = maybe.get();
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

        // allow updating owner info if provided (optional)
        if (ownerId != null) e.setOwnerId(ownerId);
        if (ownerEmail != null) e.setOwnerEmail(ownerEmail);

        e.setUpdatedAtEpochMs(Instant.now().toEpochMilli());

        Estabelecimento saved = repository.save(e);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        Optional<Estabelecimento> maybe = repository.findById(id);
        if (maybe.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Estabelecimento não encontrado"));
        }
        repository.deleteById(id);
        return ResponseEntity.ok(Map.of("deleted", id));
    }

    @GetMapping("/{id}/report")
    public ResponseEntity<?> report(@PathVariable String id) {
        Optional<Estabelecimento> maybe = repository.findById(id);
        if (maybe.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Estabelecimento não encontrado"));
        }
        Estabelecimento e = maybe.get();

        long monthly = e.getConsumoMedioMensalLitros() != null ? e.getConsumoMedioMensalLitros() : 0L;
        long daily = monthly / 30;
        int pessoas = (e.getPessoasQueUsam() != null && e.getPessoasQueUsam() > 0) ? e.getPessoasQueUsam() : 1;
        long perCapita = pessoas > 0 ? Math.round((double) daily / pessoas) : daily;

        String classification = "Médio";
        if (perCapita < 70) classification = "Baixo";
        else if (perCapita > 120) classification = "Alto";

        Map<String, Object> monitoring = new HashMap<>();
        monitoring.put("consumoMedioMensalLitros", monthly);
        monitoring.put("consumoMedioDiarioLitros", daily);
        monitoring.put("consumoPerCapitaLitros", perCapita);
        monitoring.put("classificacao", classification);

        boolean receber = e.getReceberAlertas() == null ? true : e.getReceberAlertas();
        List<Map<String, String>> alerts = new ArrayList<>();
        if (receber) {
            long limite = e.getLimiteMaxDiarioLitros() != null ? e.getLimiteMaxDiarioLitros() : 0L;
            if (limite > 0 && daily > limite) {
                alerts.add(Map.of("title", "Ultrapassou o limite diário", "desc", String.format("Consumo em 24h (%d L) maior que o limite configurado (%d L).", daily, limite)));
            } else if (limite > 0 && daily > Math.round(limite * 0.9)) {
                alerts.add(Map.of("title", "Próximo do limite diário", "desc", String.format("Consumo em 24h (%d L) atingiu >90%% do limite (%d L).", daily, limite)));
            }

            if (perCapita > 140) {
                alerts.add(Map.of("title", "Consumo por pessoa elevado", "desc", String.format("Média por pessoa ≈ %d L/dia, acima do esperado para %d pessoas.", perCapita, pessoas)));
            }

            if (e.getTemCaixaDagua() != null && e.getTemCaixaDagua()) {
                alerts.add(Map.of("title", "Verificar recargas da caixa d'água", "desc", "Monitore frequência de recarga da caixa de água: recargas frequentes podem indicar vazamento ou uso intenso."));
            } else {
                alerts.add(Map.of("title", "Monitorar consumo noturno", "desc", "Sem caixa d'água; monitore consumo noturno para identificar vazamentos."));
            }

            String tipo = e.getTipoImovel() != null ? e.getTipoImovel().toLowerCase() : "";
            if (tipo.contains("empresa") || tipo.contains("comércio")) {
                alerts.add(Map.of("title", "Picos operacionais", "desc", "Empresas costumam ter horários de pico; defina janelas de operação para evitar picos desnecessários."));
            }
        }

        long idealMinMonthly = 70L * pessoas * 30L;
        long idealMaxMonthly = 90L * pessoas * 30L;
        long diffToIdealMax = monthly - idealMaxMonthly;
        long diffPct = idealMaxMonthly > 0 ? Math.round((double) (monthly - idealMaxMonthly) / idealMaxMonthly * 100) : 0L;

        Map<String, Object> reports = new HashMap<>();
        reports.put("consumoMedioMensalLitros", monthly);
        reports.put("mediaDiariaEstimadaLitros", daily);
        reports.put("mediaPerCapitaLitros", perCapita);
        reports.put("idealMinMonthlyLitros", idealMinMonthly);
        reports.put("idealMaxMonthlyLitros", idealMaxMonthly);
        reports.put("diferencaEmLitros", diffToIdealMax);
        reports.put("diferencaPercentual", diffPct);

        List<String> tips = new ArrayList<>();
        String tipo = e.getTipoImovel() != null ? e.getTipoImovel().toLowerCase() : "";
        if (tipo.contains("casa")) {
            tips.add("Reduzir 1 minuto em cada banho e instalar arejadores nos chuveiros.");
            tips.add("Usar máquina de lavar apenas com carga completa e ciclos econômicos.");
            if (e.getTemCaixaDagua() != null && e.getTemCaixaDagua()) {
                tips.add("Monitorar número de recargas da caixa; se >1/dia, inspecionar boia e tubulações.");
            }
            tips.add("Concentrar regas do jardim em horários de menor evaporação (manhã cedo ou fim de tarde).");
        } else if (tipo.contains("apartamento")) {
            tips.add("Verificar torneiras e áreas compartilhadas; reduzir tempo de banho.");
            tips.add("Se hidrômetro não for individual, negociar métricas com o condomínio.");
        } else if (tipo.contains("empresa") || tipo.contains("comércio")) {
            tips.add("Mapear processos que consomem mais água e otimizar horários para reduzir picos.");
            tips.add("Instalar dispositivos de controle em aplicações de limpeza e irrigação.");
        } else {
            tips.add("Reveja hábitos de uso e verifique vazamentos ou equipamentos ineficientes.");
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("monitoramento", monitoring);
        if (!receber) {
            resp.put("alertasMessage", "Este estabelecimento optou por não receber alertas.");
        } else {
            resp.put("alertas", alerts);
        }
        resp.put("relatorios", reports);
        resp.put("dicas", tips);

        return ResponseEntity.ok(resp);
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
