package com.example.demo.estabelecimento;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "estabelecimentos")
public class Estabelecimento {
    @Id
    private String id;

    private String ownerId; // usuário dono (pode ser id ou fallback)
    private String ownerEmail;

    // Identificação
    private String tipoImovel; // Casa, Apartamento, Empresa, Comércio, Outro
    private String nomeEstabelecimento;

    // Endereço
    private String rua;
    private String numero;
    private String bairro;
    private String cidade;
    private String estado;
    private String cep;

    // Consumo
    private Integer pessoasQueUsam;
    private Boolean hidrometroIndividual;
    private Long consumoMedioMensalLitros;
    private Boolean temCaixaDagua;
    private Long capacidadeCaixaLitros;

    // Configs
    private Boolean receberAlertas;
    private Long limiteMaxDiarioLitros;
    private Boolean verGraficos;

    private Long createdAtEpochMs;
    private Long updatedAtEpochMs;

    public Estabelecimento() {}

    // getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }

    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }

    public String getTipoImovel() { return tipoImovel; }
    public void setTipoImovel(String tipoImovel) { this.tipoImovel = tipoImovel; }

    public String getNomeEstabelecimento() { return nomeEstabelecimento; }
    public void setNomeEstabelecimento(String nomeEstabelecimento) { this.nomeEstabelecimento = nomeEstabelecimento; }

    public String getRua() { return rua; }
    public void setRua(String rua) { this.rua = rua; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }

    public Integer getPessoasQueUsam() { return pessoasQueUsam; }
    public void setPessoasQueUsam(Integer pessoasQueUsam) { this.pessoasQueUsam = pessoasQueUsam; }

    public Boolean getHidrometroIndividual() { return hidrometroIndividual; }
    public void setHidrometroIndividual(Boolean hidrometroIndividual) { this.hidrometroIndividual = hidrometroIndividual; }

    public Long getConsumoMedioMensalLitros() { return consumoMedioMensalLitros; }
    public void setConsumoMedioMensalLitros(Long consumoMedioMensalLitros) { this.consumoMedioMensalLitros = consumoMedioMensalLitros; }

    public Boolean getTemCaixaDagua() { return temCaixaDagua; }
    public void setTemCaixaDagua(Boolean temCaixaDagua) { this.temCaixaDagua = temCaixaDagua; }

    public Long getCapacidadeCaixaLitros() { return capacidadeCaixaLitros; }
    public void setCapacidadeCaixaLitros(Long capacidadeCaixaLitros) { this.capacidadeCaixaLitros = capacidadeCaixaLitros; }

    public Boolean getReceberAlertas() { return receberAlertas; }
    public void setReceberAlertas(Boolean receberAlertas) { this.receberAlertas = receberAlertas; }

    public Long getLimiteMaxDiarioLitros() { return limiteMaxDiarioLitros; }
    public void setLimiteMaxDiarioLitros(Long limiteMaxDiarioLitros) { this.limiteMaxDiarioLitros = limiteMaxDiarioLitros; }

    public Boolean getVerGraficos() { return verGraficos; }
    public void setVerGraficos(Boolean verGraficos) { this.verGraficos = verGraficos; }

    public Long getCreatedAtEpochMs() { return createdAtEpochMs; }
    public void setCreatedAtEpochMs(Long createdAtEpochMs) { this.createdAtEpochMs = createdAtEpochMs; }

    public Long getUpdatedAtEpochMs() { return updatedAtEpochMs; }
    public void setUpdatedAtEpochMs(Long updatedAtEpochMs) { this.updatedAtEpochMs = updatedAtEpochMs; }
}
