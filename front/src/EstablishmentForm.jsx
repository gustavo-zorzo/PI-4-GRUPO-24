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
      if (nameRef.current && typeof nameRef.current.focus === 'function') {
        nameRef.current.focus();
      } else {
        const el = document.querySelector('input[name="nomeEstabelecimento"]');
        el?.focus();
      }
    } catch (e) {}
  }, []);

  function focusNameField() {
    try {
      if (nameRef.current && typeof nameRef.current.focus === 'function') {
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
    if (type === "checkbox") v = checked;
    if (type === "number") v = value === "" ? "" : Number(value);
    setForm((f) => ({ ...f, [name]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      tipoImovel: form.tipoImovel,
      nomeEstabelecimento: form.nomeEstabelecimento,
      rua: form.rua,
      numero: form.numero,
      bairro: form.bairro,
      cidade: form.cidade,
      estado: form.estado,
      cep: form.cep,
      pessoasQueUsam: Number(form.pessoasQueUsam),
      hidrometroIndividual: !!form.hidrometroIndividual,
      consumoMedioMensalLitros: Number(form.consumoMedioMensalLitros),
      temCaixaDagua: !!form.temCaixaDagua,
      capacidadeCaixaLitros: form.capacidadeCaixaLitros ? Number(form.capacidadeCaixaLitros) : null,
      receberAlertas: !!form.receberAlertas,
      limiteMaxDiarioLitros: Number(form.limiteMaxDiarioLitros),
      verGraficos: !!form.verGraficos,
    };

    try {
      // send ownerId or ownerEmail
      const ownerId = user?.id;
      const ownerEmail = user?.email;
      const q = ownerId ? `?ownerId=${encodeURIComponent(ownerId)}` : `?ownerEmail=${encodeURIComponent(ownerEmail)}`;

      const res = await fetch(`http://localhost:8080/api/estabelecimentos${q}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // tenta ler JSON, senão texto cru
        let body;
        try {
          body = await res.json();
        } catch (e) {
          body = await res.text().catch(() => null);
        }
        const msg = body && body.error ? body.error : (typeof body === 'string' ? body : `HTTP ${res.status}`);
        throw new Error(msg || `Erro ao salvar estabelecimento (status ${res.status})`);
      }

      const saved = await res.json();
      onSaved && onSaved(saved);
      // reset form so user can add another
      setForm(initialForm);
      setSavedSuccess(true);
      // focus para permitir adicionar outro rapidamente
      setTimeout(() => {
        setSavedSuccess(false);
        focusNameField();
      }, 300);
    } catch (err) {
      console.error('POST error, falling back to localStorage:', err);
      // fallback: salvar localmente se o backend não estiver acessível
      try {
        const ownerId = user?.id;
        const ownerEmail = user?.email;
        const ownerKey = ownerId || ownerEmail || 'anon';
        const now = Date.now();
        const localSaved = {
          id: `local-${now}-${Math.floor(Math.random()*10000)}`,
          ownerId: ownerId || null,
          ownerEmail: ownerEmail || null,
          ...payload,
          createdAtEpochMs: now,
          updatedAtEpochMs: now,
          _local: true,
        };

        const storeRaw = localStorage.getItem('hs_estabelecimentos') || '{}';
        const store = JSON.parse(storeRaw);
        store[ownerKey] = store[ownerKey] || [];
        store[ownerKey].push(localSaved);
        localStorage.setItem('hs_estabelecimentos', JSON.stringify(store));

        onSaved && onSaved(localSaved);
        // reset form so user can add another
        setForm(initialForm);
        setSavedSuccess(true);
        setTimeout(() => {
          setSavedSuccess(false);
          focusNameField();
        }, 300);
        return;
      } catch (localErr) {
        console.error('Local save failed', localErr);
        setError(err.message || String(err));
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="rounded-2xl border-muted">
      <CardHeader>
        <CardTitle>Cadastre seu Estabelecimento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-semibold">Tipo de imóvel</label>
            <select name="tipoImovel" value={form.tipoImovel} onChange={change} className="w-full rounded-md border px-3 py-2">
              <option>Casa</option>
              <option>Apartamento</option>
              <option>Empresa</option>
              <option>Comércio</option>
              <option>Outro</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Nome do estabelecimento</label>
            <Input ref={nameRef} name="nomeEstabelecimento" value={form.nomeEstabelecimento} onChange={change} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-semibold">Rua</label>
              <Input name="rua" value={form.rua} onChange={change} required />
            </div>
            <div>
              <label className="block mb-1 text-sm font-semibold">Número</label>
              <Input name="numero" value={form.numero} onChange={change} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-semibold">Bairro</label>
              <Input name="bairro" value={form.bairro} onChange={change} required />
            </div>
            <div>
              <label className="block mb-1 text-sm font-semibold">Cidade</label>
              <Input name="cidade" value={form.cidade} onChange={change} required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block mb-1 text-sm font-semibold">Estado</label>
              <Input name="estado" value={form.estado} onChange={change} required />
            </div>
            <div className="col-span-2">
              <label className="block mb-1 text-sm font-semibold">CEP</label>
              <Input name="cep" value={form.cep} onChange={change} required />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Quantidade de pessoas que usam água diariamente no local</label>
            <Input name="pessoasQueUsam" type="number" min={1} value={form.pessoasQueUsam} onChange={change} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-semibold">Possui hidrômetro individual?</label>
              <div className="flex items-center gap-4 mt-1">
                <label className="flex items-center gap-2"><input type="radio" name="hidrometroIndividual" value={true} checked={form.hidrometroIndividual === true} onChange={() => setForm(f => ({...f, hidrometroIndividual: true}))} /> Sim</label>
                <label className="flex items-center gap-2"><input type="radio" name="hidrometroIndividual" value={false} checked={form.hidrometroIndividual === false} onChange={() => setForm(f => ({...f, hidrometroIndividual: false}))} /> Não</label>
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm font-semibold">Consumo médio mensal estimado (litros)</label>
              <Input name="consumoMedioMensalLitros" type="number" value={form.consumoMedioMensalLitros} onChange={change} required />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Tem caixa d'água?</label>
            <div className="flex items-center gap-4 mt-1">
              <label className="flex items-center gap-2"><input type="radio" name="temCaixaDagua" value={true} checked={form.temCaixaDagua === true} onChange={() => setForm(f => ({...f, temCaixaDagua: true}))} /> Sim</label>
              <label className="flex items-center gap-2"><input type="radio" name="temCaixaDagua" value={false} checked={form.temCaixaDagua === false} onChange={() => setForm(f => ({...f, temCaixaDagua: false}))} /> Não</label>
            </div>
          </div>

          {form.temCaixaDagua && (
            <div>
              <label className="block mb-1 text-sm font-semibold">Capacidade da caixa d'água (litros)</label>
              <Input name="capacidadeCaixaLitros" type="number" value={form.capacidadeCaixaLitros} onChange={change} />
            </div>
          )}

          <div>
            <label className="block mb-1 text-sm font-semibold">Deseja receber alertas de consumo excessivo?</label>
            <div className="flex items-center gap-4 mt-1">
              <label className="flex items-center gap-2"><input type="radio" name="receberAlertas" value={true} checked={form.receberAlertas === true} onChange={() => setForm(f => ({...f, receberAlertas: true}))} /> Sim</label>
              <label className="flex items-center gap-2"><input type="radio" name="receberAlertas" value={false} checked={form.receberAlertas === false} onChange={() => setForm(f => ({...f, receberAlertas: false}))} /> Não</label>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Defina um limite máximo de consumo por dia (litros)</label>
            <Input name="limiteMaxDiarioLitros" type="number" value={form.limiteMaxDiarioLitros} onChange={change} required />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Deseja ver gráficos semanais/mensais?</label>
            <div className="flex items-center gap-4 mt-1">
              <label className="flex items-center gap-2"><input type="radio" name="verGraficos" value={true} checked={form.verGraficos === true} onChange={() => setForm(f => ({...f, verGraficos: true}))} /> Sim</label>
              <label className="flex items-center gap-2"><input type="radio" name="verGraficos" value={false} checked={form.verGraficos === false} onChange={() => setForm(f => ({...f, verGraficos: false}))} /> Não</label>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {savedSuccess && <p className="text-sm text-green-600">Estabelecimento salvo com sucesso.</p>}

          <div className="flex items-center gap-3 mt-4">
            <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar Estabelecimento'}</Button>
            <Button type="button" variant="ghost" onClick={() => onClose && onClose()}>Fechar formulário</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
