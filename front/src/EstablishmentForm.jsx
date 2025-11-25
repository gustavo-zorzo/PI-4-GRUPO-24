import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function EstablishmentForm({ user, onSaved, onClose }) {
  const initialForm = {
    tipoImovel: "Casa",
    nomeEstabelecimento: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    pessoasQueUsam: 1,
    hidrometroIndividual: false,
    consumoMedioMensalLitros: 0,
    temCaixaDagua: false,
    capacidadeCaixaLitros: 0,
    receberAlertas: true,
    limiteMaxDiarioLitros: 500,
    verGraficos: true,
  };

  const [form, setForm] = useState(initialForm);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    // focus no campo nome quando o formulário aparecer
    try {
      if (nameRef.current && typeof nameRef.current.focus === "function") {
        nameRef.current.focus();
      } else {
        const el = document.querySelector('input[name="nomeEstabelecimento"]');
        el?.focus();
      }
    } catch (e) {}
  }, []);

  function focusNameField() {
    try {
      if (nameRef.current && typeof nameRef.current.focus === "function") {
        nameRef.current.focus();
      } else {
        const el = document.querySelector('input[name="nomeEstabelecimento"]');
        el?.focus();
      }
    } catch (e) {}
  }

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function change(e) {
    const { name, value, type, checked } = e.target;
    let v = value;

    // regras específicas
    if (name === "rua" || name === "bairro" || name === "cidade") {
      // apenas letras (com acentos) e espaços
      v = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "");
    } else if (name === "numero") {
      // apenas dígitos
      v = value.replace(/\D/g, "");
    } else if (name === "cep") {
      // só números + máscara 00000-000
      let digits = value.replace(/\D/g, "");
      if (digits.length > 8) digits = digits.slice(0, 8);
      if (digits.length <= 5) {
        v = digits;
      } else {
        v = digits.slice(0, 5) + "-" + digits.slice(5);
      }
    } else if (type === "checkbox") {
      v = checked;
    } else if (type === "number") {
      v = value === "" ? "" : Number(value);
    }

    setForm((f) => ({ ...f, [name]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // === VALIDAÇÕES ===
    if (!form.nomeEstabelecimento.trim()) {
      setError("Informe o nome do estabelecimento.");
      setSaving(false);
      focusNameField();
      return;
    }

    if (!form.rua.trim()) {
      setError("Informe a rua (somente letras).");
      setSaving(false);
      return;
    }

    if (!form.bairro.trim()) {
      setError("Informe o bairro (somente letras).");
      setSaving(false);
      return;
    }

    if (!form.cidade.trim()) {
      setError("Informe a cidade (somente letras).");
      setSaving(false);
      return;
    }

    if (!form.numero || !/^\d+$/.test(form.numero)) {
      setError("Informe apenas números no campo Número.");
      setSaving(false);
      return;
    }

    if (!form.estado) {
      setError("Selecione o estado.");
      setSaving(false);
      return;
    }

    const pessoas = Number(form.pessoasQueUsam);
    if (!Number.isFinite(pessoas) || !Number.isInteger(pessoas) || pessoas < 1) {
      setError("Quantidade de pessoas deve ser um número inteiro maior ou igual a 1.");
      setSaving(false);
      return;
    }

    let cepDigits = "";
    if (form.cep) {
      cepDigits = String(form.cep).replace(/\D/g, "");
      if (cepDigits.length !== 8) {
        setError("Informe um CEP válido com 8 dígitos.");
        setSaving(false);
        return;
      }
    }

    const consumo = Number(form.consumoMedioMensalLitros);
    if (!Number.isFinite(consumo) || consumo <= 0) {
      setError("Informe um consumo médio mensal válido (em litros).");
      setSaving(false);
      return;
    }

    if (form.temCaixaDagua) {
      const capacidade = Number(form.capacidadeCaixaLitros);
      if (!Number.isFinite(capacidade) || capacidade <= 0) {
        setError("Informe uma capacidade válida da caixa d'água (em litros).");
        setSaving(false);
        return;
      }
    }

    const limite = Number(form.limiteMaxDiarioLitros);
    if (!Number.isFinite(limite) || limite <= 0) {
      setError("Informe um limite máximo diário válido (em litros).");
      setSaving(false);
      return;
    }

    const payload = {
      tipoImovel: form.tipoImovel,
      nomeEstabelecimento: form.nomeEstabelecimento.trim(),
      rua: form.rua.trim(),
      numero: form.numero,
      bairro: form.bairro.trim(),
      cidade: form.cidade.trim(),
      estado: form.estado,
      cep: cepDigits, // envia só os dígitos para o backend
      pessoasQueUsam: pessoas,
      hidrometroIndividual: !!form.hidrometroIndividual,
      consumoMedioMensalLitros: consumo,
      temCaixaDagua: !!form.temCaixaDagua,
      capacidadeCaixaLitros: form.capacidadeCaixaLitros
        ? Number(form.capacidadeCaixaLitros)
        : null,
      receberAlertas: !!form.receberAlertas,
      limiteMaxDiarioLitros: limite,
      verGraficos: !!form.verGraficos,
    };

    try {
      // send ownerId or ownerEmail
      const ownerId = user?.id;
      const ownerEmail = user?.email;
      const q = ownerId
        ? `?ownerId=${encodeURIComponent(ownerId)}`
        : `?ownerEmail=${encodeURIComponent(ownerEmail)}`;

      const res = await fetch(
        `http://localhost:8080/api/estabelecimentos${q}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        // tenta ler JSON, senão texto cru
        let body;
        try {
          body = await res.json();
        } catch (e) {
          body = await res.text().catch(() => null);
        }
        const msg =
          body && body.error
            ? body.error
            : typeof body === "string"
            ? body
            : `HTTP ${res.status}`;
        throw new Error(msg || `Erro ao salvar estabelecimento (status ${res.status})`);
      }

      const saved = await res.json();
      onSaved && onSaved(saved);
      // reset form
      setForm(initialForm);
      setSavedSuccess(true);
      // fecha o módulo depois de salvar
      setTimeout(() => {
        setSavedSuccess(false);
        if (onClose) onClose();
      }, 300);
    } catch (err) {
      console.error("POST error, falling back to localStorage:", err);
      // fallback: salvar localmente se o backend não estiver acessível
      try {
        const ownerId = user?.id;
        const ownerEmail = user?.email;
        const ownerKey = ownerId || ownerEmail || "anon";
        const now = Date.now();
        const localSaved = {
          id: `local-${now}-${Math.floor(Math.random() * 10000)}`,
          ownerId: ownerId || null,
          ownerEmail: ownerEmail || null,
          ...payload,
          createdAtEpochMs: now,
          updatedAtEpochMs: now,
          _local: true,
        };

        const storeRaw = localStorage.getItem("hs_estabelecimentos") || "{}";
        const store = JSON.parse(storeRaw);
        store[ownerKey] = store[ownerKey] || [];
        store[ownerKey].push(localSaved);
        localStorage.setItem("hs_estabelecimentos", JSON.stringify(store));

        onSaved && onSaved(localSaved);
        // reset form
        setForm(initialForm);
        setSavedSuccess(true);
        setTimeout(() => {
          setSavedSuccess(false);
          if (onClose) onClose();
        }, 300);
        return;
      } catch (localErr) {
        console.error("Local save failed", localErr);
        setError(err.message || String(err));
      }
    } finally {
      setSaving(false);
    }
  }

  const estadosBrasil = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  return (
    <Card className="rounded-2xl border-muted">
      <CardHeader>
        <CardTitle>Cadastre seu Estabelecimento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-semibold">
              Tipo de imóvel
            </label>
            <select
              name="tipoImovel"
              value={form.tipoImovel}
              onChange={change}
              className="w-full rounded-md border px-3 py-2"
            >
              <option>Casa</option>
              <option>Apartamento</option>
              <option>Empresa</option>
              <option>Comércio</option>
              <option>Outro</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">
              Nome do estabelecimento
            </label>
            <Input
              ref={nameRef}
              name="nomeEstabelecimento"
              value={form.nomeEstabelecimento}
              onChange={change}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-semibold">Rua</label>
              <Input
                name="rua"
                value={form.rua}
                onChange={change}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-semibold">
                Número
              </label>
              <Input
                name="numero"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.numero}
                onChange={change}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-semibold">
                Bairro
              </label>
              <Input
                name="bairro"
                value={form.bairro}
                onChange={change}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-semibold">
                Cidade
              </label>
              <Input
                name="cidade"
                value={form.cidade}
                onChange={change}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block mb-1 text-sm font-semibold">
                Estado
              </label>
              <select
                name="estado"
                value={form.estado}
                onChange={change}
                className="w-full rounded-md border px-3 py-2"
                required
              >
                <option value="">Selecione</option>
                {estadosBrasil.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block mb-1 text-sm font-semibold">CEP</label>
              <Input
                name="cep"
                value={form.cep}
                onChange={change}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">
              Quantidade de pessoas que usam água diariamente no local
            </label>
            <Input
              name="pessoasQueUsam"
              type="number"
              min={1}
              value={form.pessoasQueUsam}
              onChange={change}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-semibold">
                Possui hidrômetro individual?
              </label>
              <div className="flex items-center gap-4 mt-1">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hidrometroIndividual"
                    value={true}
                    checked={form.hidrometroIndividual === true}
                    onChange={() =>
                      setForm((f) => ({ ...f, hidrometroIndividual: true }))
                    }
                  />{" "}
                  Sim
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hidrometroIndividual"
                    value={false}
                    checked={form.hidrometroIndividual === false}
                    onChange={() =>
                      setForm((f) => ({ ...f, hidrometroIndividual: false }))
                    }
                  />{" "}
                  Não
                </label>
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm font-semibold">
                Consumo médio mensal estimado (litros)
              </label>
              <Input
                name="consumoMedioMensalLitros"
                type="number"
                value={form.consumoMedioMensalLitros}
                onChange={change}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">
              Tem caixa d'água?
            </label>
            <div className="flex items-center gap-4 mt-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="temCaixaDagua"
                  value={true}
                  checked={form.temCaixaDagua === true}
                  onChange={() =>
                    setForm((f) => ({ ...f, temCaixaDagua: true }))
                  }
                />{" "}
                Sim
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="temCaixaDagua"
                  value={false}
                  checked={form.temCaixaDagua === false}
                  onChange={() =>
                    setForm((f) => ({ ...f, temCaixaDagua: false }))
                  }
                />{" "}
                Não
              </label>
            </div>
          </div>

          {form.temCaixaDagua && (
            <div>
              <label className="block mb-1 text-sm font-semibold">
                Capacidade da caixa d'água (litros)
              </label>
              <Input
                name="capacidadeCaixaLitros"
                type="number"
                value={form.capacidadeCaixaLitros}
                onChange={change}
              />
            </div>
          )}

          <div>
            <label className="block mb-1 text-sm font-semibold">
              Deseja receber alertas de consumo excessivo?
            </label>
            <div className="flex items-center gap-4 mt-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="receberAlertas"
                  value={true}
                  checked={form.receberAlertas === true}
                  onChange={() =>
                    setForm((f) => ({ ...f, receberAlertas: true }))
                  }
                />{" "}
                Sim
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="receberAlertas"
                  value={false}
                  checked={form.receberAlertas === false}
                  onChange={() =>
                    setForm((f) => ({ ...f, receberAlertas: false }))
                  }
                />{" "}
                Não
              </label>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">
              Defina um limite máximo de consumo por dia (litros)
            </label>
            <Input
              name="limiteMaxDiarioLitros"
              type="number"
              value={form.limiteMaxDiarioLitros}
              onChange={change}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">
              Deseja ver gráficos semanais/mensais?
            </label>
            <div className="flex items-center gap-4 mt-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="verGraficos"
                  value={true}
                  checked={form.verGraficos === true}
                  onChange={() =>
                    setForm((f) => ({ ...f, verGraficos: true }))
                  }
                />{" "}
                Sim
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="verGraficos"
                  value={false}
                  checked={form.verGraficos === false}
                  onChange={() =>
                    setForm((f) => ({ ...f, verGraficos: false }))
                  }
                />{" "}
                Não
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {savedSuccess && (
            <p className="text-sm text-green-600">
              Estabelecimento salvo com sucesso.
            </p>
          )}

          <div className="flex items-center gap-3 mt-4">
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar Estabelecimento"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onClose && onClose()}
            >
              Fechar formulário
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
