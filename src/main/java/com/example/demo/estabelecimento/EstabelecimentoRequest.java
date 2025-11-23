package com.example.demo.estabelecimento;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EstabelecimentoRequest {
    @NotBlank
    private String tipoImovel;
    @NotBlank
    private String nomeEstabelecimento;

    @NotBlank
    private String rua;
    @NotBlank
    private String numero;
    @NotBlank
    private String bairro;
    @NotBlank
    private String cidade;
    @NotBlank
    private String estado;
    @NotBlank
    private String cep;

    @NotNull
    private Integer pessoasQueUsam;
    @NotNull
    private Boolean hidrometroIndividual;
    @NotNull
    private Long consumoMedioMensalLitros;
    @NotNull
    private Boolean temCaixaDagua;
    private Long capacidadeCaixaLitros;

    @NotNull
    private Boolean receberAlertas;
    @NotNull
    private Long limiteMaxDiarioLitros;
    @NotNull
    private Boolean verGraficos;

    public EstabelecimentoRequest() {}

    // getters and setters
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
}
