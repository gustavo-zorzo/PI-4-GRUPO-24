import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Droplet,
  BarChart3,
  AlertTriangle,
  ShieldCheck,
  Bell,
  Gauge,
  Leaf,
  Wifi,
  Sparkles,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { LoginModal } from "./LoginModal";
import EstablishmentForm from "./EstablishmentForm";

// ------------------------------------------------------------
// HydroSave — Interactive React Landing + Live Demo
// ------------------------------------------------------------

const features = [
  {
    icon: <Droplet className="h-6 w-6" />,
    title: "Monitoramento em tempo real",
    desc: "Acompanhe seu consumo de água por minuto, aparelho e ambiente.",
  },
  {
    icon: <AlertTriangle className="h-6 w-6" />,
    title: "Alertas de vazamento",
    desc: "Receba notificações assim que um padrão anormal for detectado.",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Relatórios inteligentes",
    desc: "Relatórios semanais e mensais com insights acionáveis.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Privacidade e segurança",
    desc: "Dados criptografados de ponta a ponta e consentimento granular.",
  },
  {
    icon: <Bell className="h-6 w-6" />,
    title: "Alertas personalizáveis",
    desc: "Defina metas, limites e horários de silêncio para notificações.",
  },
  {
    icon: <Wifi className="h-6 w-6" />,
    title: "IoT plug-and-play",
    desc: "Integração simples com sensores compatíveis via Wi-Fi.",
  },
];

const tiers = [
  {
    name: "Starter",
    price: "R$ 0",
    period: "/mês",
    highlight: "Ideal para testar",
    bullets: ["1 imóvel", "Relatórios básicos", "Alertas por e-mail"],
    cta: "Começar agora",
  },
  {
    name: "Essencial",
    price: "R$ 29",
    period: "/mês",
    highlight: "Mais popular",
    bullets: ["Até 3 imóveis", "Dashboard em tempo real", "Alertas push & SMS"],
    featured: true,
    cta: "Assinar Essencial",
  },
  {
    name: "Pro",
    price: "R$ 79",
    period: "/mês",
    highlight: "Para empresas e condomínios",
    bullets: ["Imóveis ilimitados", "Exportação CSV/API", "Suporte prioritário"],
    cta: "Falar com vendas",
  },
];

function WaveDivider({ flip = false }) {
  return (
    <svg
      viewBox="0 0 1440 140"
      aria-hidden
      className={`block w-full ${flip ? "rotate-180" : ""}`}
    >
      <path
        fill="currentColor"
        className="text-primary/10"
        d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,85.3C1120,96,1280,96,1360,96L1440,96L1440,140L1360,140C1280,140,1120,140,960,140C800,140,640,140,480,140C320,140,160,140,80,140L0,140Z"
      />
    </svg>
  );
}

function Nav({ dark, onToggleDark, onLoginClick, user, onLogout, onNavigate }) {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
      {/* LOGO */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10">
          <Droplet className="h-5 w-5 text-primary" />
        </div>

        <span className="text-xl font-semibold tracking-tight text-foreground">
          HydroSave
        </span>

        <Badge className="ml-2 rounded-full text-muted-foreground">
          Beta
        </Badge>
      </div>

      {/* LINKS */}
      <div className="hidden items-center gap-6 md:flex">
        {user ? (
          <>
            <button onClick={() => onNavigate?.("home")} className="text-sm text-foreground hover:text-primary">
              Home
            </button>

            <button onClick={() => onNavigate?.("realtime")} className="text-sm text-foreground hover:text-primary">
              Monitoramento
            </button>

            <button onClick={() => onNavigate?.("alerts")} className="text-sm text-foreground hover:text-primary">
              Alertas
            </button>

            <button onClick={() => onNavigate?.("reports")} className="text-sm text-foreground hover:text-primary">
              Relatórios
            </button>

            <button onClick={() => onNavigate?.("tips")} className="text-sm text-foreground hover:text-primary">
              Dicas
            </button>
          </>
        ) : (
          <>
            <a href="#features" className="text-sm text-foreground hover:text-primary">
              Recursos
            </a>

            <a href="#demo" className="text-sm text-foreground hover:text-primary">
              Demo
            </a>

            <a href="#pricing" className="text-sm text-foreground hover:text-primary">
              Planos
            </a>

            <a href="#faq" className="text-sm text-foreground hover:text-primary">
              FAQ
            </a>
          </>
        )}
      </div>

      {/* SWITCH + LOGIN */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{dark ? "Dark" : "Light"}</span>
          <Switch checked={dark} onCheckedChange={onToggleDark} />
        </div>

        {user ? (
          <>
            <span className="max-w-[140px] truncate text-sm text-foreground">
              Olá, {user.name}
            </span>
            <Button variant="outline" className="rounded-xl" onClick={onLogout}>
              Sair
            </Button>
          </>
        ) : (
          <Button className="rounded-xl" onClick={onLoginClick}>
            Entrar
          </Button>
        )}
      </div>
    </div>
  );
}


function Hero() {
  return (
    <div className="relative mx-auto max-w-7xl px-6 pt-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid items-center gap-10 md:grid-cols-2"
      >
        <div>
          <Badge className="mb-3 rounded-full px-3 py-1" variant="secondary">
            <Sparkles className="mr-2 h-4 w-4" /> Sustentabilidade na prática
          </Badge>
          <h1 className="text-balance text-4xl font-bold leading-tight md:text-5xl">
            Monitoramento inteligente para reduzir seu consumo de água
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Acompanhe em tempo real, receba alertas de vazamento e economize
            até <b>30%</b> com relatórios inteligentes.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" className="rounded-xl">
              Começar grátis
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl">
              Ver planos
            </Button>
          </div>
          <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
            <Gauge className="h-4 w-4" /> Meta: impactar 100k famílias em 2 anos
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <DemoPanel />
        </motion.div>
      </motion.div>
    </div>
  );
}

function FeatureGrid() {
  return (
    <div id="features" className="mx-auto max-w-7xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Recursos que fazem a diferença
        </h2>
        <p className="mt-3 text-muted-foreground">
          Mais controle, menos desperdício — com uma experiência elegante.
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Card className="h-full rounded-2xl border-muted bg-background/60 backdrop-blur">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {f.icon}
                </div>
                <CardTitle className="text-lg">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function useMockData(multiplier) {
  // Gera dados de 30 dias com padrão base + ruído, afetado pelo multiplicador (meta/limite)
  return useMemo(() => {
    const arr = Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
      const base = 320 + Math.sin(d / 2.8) * 40 + Math.cos(d / 3.7) * 30;
      const noise = (Math.random() - 0.5) * 25;
      const used = Math.max(120, base + noise) * multiplier;
      return { day: d, consumo: Math.round(used) };
    });
    return arr;
  }, [multiplier]);
}

function DemoPanel() {
  const [target, setTarget] = useState(350); // L/dia
  const [ecoMode, setEcoMode] = useState(true);
  const multiplier = ecoMode ? 0.88 : 1; // modo eco reduz consumo
  const data = useMockData(multiplier);

  const avg = useMemo(
    () => Math.round(data.reduce((a, b) => a + b.consumo, 0) / data.length),
    [data]
  );
  const overDays = data.filter((d) => d.consumo > target).length;

  return (
    <Card id="demo" className="rounded-2xl border-muted">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Demo em tempo real</CardTitle>
          <Badge
  variant="outline"
  className="rounded-full bg-white/10 text-foreground border-white/20"
>
  <Leaf className="mr-1 h-3 w-3" />{" "}
  {ecoMode ? "Eco ligado" : "Eco desligado"}
</Badge>
...
<Badge
  variant="secondary"
  className="rounded-full bg-white/10 text-foreground"
>
  {target} L/dia
</Badge>

        </div>
        <p className="text-sm text-muted-foreground">
          Simulação de consumo diário (L/dia) com alertas dinâmicos.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="h-[240px] w-full rounded-xl border bg-muted/20 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(v) => `${v} L`}
                    labelFormatter={(l) => `Dia ${l}`}
                  />
                  <ReferenceLine y={target} strokeDasharray="5 5" />
                  <Line
                    type="monotone"
                    dataKey="consumo"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Limite de alerta</span>
                <Badge variant="secondary" className="rounded-full">
                  {target} L/dia
                </Badge>
              </div>
              <input
                type="range"
                min={200}
                max={600}
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value))}
                className="range w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Leaf className="h-4 w-4" /> Modo Eco
              </div>
              <Switch checked={ecoMode} onCheckedChange={setEcoMode} />
            </div>
            <Separator />
            <div className="rounded-xl border bg-background p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Média 30 dias</span>
                <span className="font-medium">{avg} L/dia</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Dias acima do limite
                </span>
                <span
                  className={`font-medium ${
                    overDays > 7 ? "text-red-500" : ""
                  }`}
                >
                  {overDays} dias
                </span>
              </div>
            </div>
            <div className="rounded-xl border bg-background p-3 text-sm">
              <div className="mb-2 flex items-center gap-2 font-medium">
                <Bell className="h-4 w-4" /> Alertas
              </div>
              {overDays === 0 ? (
                <p className="text-muted-foreground">
                  Tudo certo! Nenhum alerta recente 🚀
                </p>
              ) : (
                <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                  <li>
                    Consumo acima de {target} L/dia detectado em {overDays}{" "}
                    {overDays === 1 ? "dia" : "dias"}.
                  </li>
                  <li>
                    Dica: ative o modo Eco e verifique vazamentos nos banheiros.
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Pricing() {
  return (
    <div id="pricing" className="mx-auto max-w-7xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">
          Planos simples e transparentes
        </h2>
        <p className="mt-3 text-muted-foreground">
          Escolha o plano ideal para sua casa, empresa ou condomínio.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {tiers.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Card
              className={`h-full rounded-2xl border-muted ${
                t.featured ? "ring-2 ring-primary" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t.name}</CardTitle>
                  {t.featured ? (
                    <Badge className="rounded-full">Mais popular</Badge>
                  ) : (
                    <span />
                  )}
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{t.price}</span>
                  <span className="text-muted-foreground">{t.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t.highlight}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  {t.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" /> {b}
                    </li>
                  ))}
                </ul>
                <Button className="mt-4 w-full rounded-xl">{t.cta}</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TabsSection() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <Tabs defaultValue="residencial" className="w-full">
        <TabsList className="mx-auto grid w-full max-w-xl grid-cols-3 rounded-2xl">
          <TabsTrigger value="residencial">Residencial</TabsTrigger>
          <TabsTrigger value="empresarial">Empresarial</TabsTrigger>
          <TabsTrigger value="condominios">Condomínios</TabsTrigger>
        </TabsList>
        <TabsContent value="residencial" className="mt-6">
          <Card className="rounded-2xl border-muted">
            <CardContent className="p-6 text-muted-foreground">
              Reduza gastos no lar com metas, alertas e relatórios de fácil
              entendimento.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="empresarial" className="mt-6">
          <Card className="rounded-2xl border-muted">
            <CardContent className="p-6 text-muted-foreground">
              Controle custos operacionais e crie políticas de uso consciente
              com dashboards.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="condominios" className="mt-6">
          <Card className="rounded-2xl border-muted">
            <CardContent className="p-6 text-muted-foreground">
              Gestão coletiva eficiente: comparativos por unidade e detecção de
              vazamentos.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Contact() {
  return (
    <div id="faq" className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-2xl font-semibold">Fale com a gente</h3>
          <p className="mt-2 text-muted-foreground">
            Tem dúvidas sobre sensores, integração ou planos? Envie uma
            mensagem.
          </p>
          <form className="mt-6 space-y-3">
            <Input placeholder="Seu nome" className="rounded-xl" />
            <Input
              placeholder="Seu e-mail"
              type="email"
              className="rounded-xl"
            />
            <Textarea
              placeholder="Como podemos ajudar?"
              className="min-h-[120px] rounded-xl"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4" /> Seus dados não serão
                compartilhados.
              </div>
              <Button className="rounded-xl">Enviar</Button>
            </div>
          </form>
        </div>
        <div>
          <h3 className="text-2xl font-semibold">Perguntas frequentes</h3>
          <div className="mt-4 space-y-4 text-sm">
            <FAQ
              q="Como funciona a detecção de vazamentos?"
              a="Monitoramos padrões contínuos de fluxo e anomalias no histórico para sinalizar possíveis vazamentos em tempo real."
            />
            <FAQ
              q="Preciso de instalação elétrica especial?"
              a="Não. Os sensores IoT funcionam com Wi-Fi padrão e alimentação comum."
            />
            <FAQ
              q="Posso exportar os relatórios?"
              a="Sim, planos Pro oferecem CSV e acesso via API."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQ({ q, a }) {
  return (
    <Card className="rounded-2xl border-muted">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{q}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{a}</p>
      </CardContent>
    </Card>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Droplet className="h-4 w-4" /> HydroSave © {new Date().getFullYear()}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <a className="hover:text-foreground" href="#">
            Termos
          </a>
          <a className="hover:text-foreground" href="#">
            Privacidade
          </a>
          <a className="hover:text-foreground" href="#">
            Suporte
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function HydroSaveSite() {
  const getInitialDark = () => {
    try {
      const saved = localStorage.getItem("hs:theme");
      if (saved === "dark") return true;
      if (saved === "light") return false;
      return (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    } catch (e) {
      return true;
    }
  };

  const [dark, setDark] = useState(getInitialDark);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("hs_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [page, setPage] = useState("home");
  const [establishments, setEstablishments] = useState([]);
  const [showEstForm, setShowEstForm] = useState(false);
  const [selectedEst, setSelectedEst] = useState(null);

  const fetchEstablishments = async (u) => {
    if (!u) return setEstablishments([]);
    try {
      const ownerId = u.id;
      const ownerEmail = u.email;
      const q = ownerId ? `?ownerId=${encodeURIComponent(ownerId)}` : `?ownerEmail=${encodeURIComponent(ownerEmail)}`;
      const res = await fetch(`http://localhost:8080/api/estabelecimentos${q}`);
      if (!res.ok) return setEstablishments([]);
      const data = await res.json();
      setEstablishments(data || []);
      // tentar sincronizar quaisquer itens locais pendentes para o backend
      try {
        await syncLocalToBackend(u);
      } catch (syncErr) {
        console.warn('syncLocalToBackend failed', syncErr);
      }
    } catch (err) {
      console.error('Failed to fetch from backend, loading localStorage fallback', err);
      try {
        const ownerKey = (u?.id) || (u?.email) || 'anon';
        const raw = localStorage.getItem('hs_estabelecimentos') || '{}';
        const store = JSON.parse(raw);
        const local = store[ownerKey] || [];
        setEstablishments(local);
      } catch (le) {
        console.error('Failed to load local establishments', le);
        setEstablishments([]);
      }
    }
  };

  const syncLocalToBackend = async (u) => {
    if (!u) return;
    const ownerKey = (u?.id) || (u?.email) || 'anon';
    try {
      const raw = localStorage.getItem('hs_estabelecimentos') || '{}';
      const store = JSON.parse(raw);
      const localList = store[ownerKey] || [];
      if (!localList.length) return;

      const toSync = localList.filter((it) => it._local);
      if (!toSync.length) return;

      const backendBase = 'http://localhost:8080';
      for (const it of toSync) {
        const payload = {
          tipoImovel: it.tipoImovel,
          nomeEstabelecimento: it.nomeEstabelecimento,
          rua: it.rua,
          numero: it.numero,
          bairro: it.bairro,
          cidade: it.cidade,
          estado: it.estado,
          cep: it.cep,
          pessoasQueUsam: Number(it.pessoasQueUsam) || 0,
          hidrometroIndividual: !!it.hidrometroIndividual,
          consumoMedioMensalLitros: Number(it.consumoMedioMensalLitros) || 0,
          temCaixaDagua: !!it.temCaixaDagua,
          capacidadeCaixaLitros: it.capacidadeCaixaLitros ? Number(it.capacidadeCaixaLitros) : null,
          receberAlertas: !!it.receberAlertas,
          limiteMaxDiarioLitros: Number(it.limiteMaxDiarioLitros) || 0,
          verGraficos: !!it.verGraficos,
        };

        try {
          const q = u.id ? `?ownerId=${encodeURIComponent(u.id)}` : `?ownerEmail=${encodeURIComponent(u.email)}`;
          const resp = await fetch(`${backendBase}/api/estabelecimentos${q}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (resp.ok) {
            // remove este item do armazenamento local
            store[ownerKey] = store[ownerKey].filter((x) => x.id !== it.id);
            localStorage.setItem('hs_estabelecimentos', JSON.stringify(store));
          } else {
            // se falhar no servidor, não prossegue com esse item
            const text = await resp.text().catch(() => null);
            console.warn('Failed to sync item', it.id, resp.status, text);
          }
        } catch (e) {
          console.error('Network error while syncing', e);
          throw e; // abort sync loop on network error
        }
      }

      // após sincronizar, refazer fetch para atualizar a lista do backend
      try {
        const q2 = u.id ? `?ownerId=${encodeURIComponent(u.id)}` : `?ownerEmail=${encodeURIComponent(u.email)}`;
        const r2 = await fetch(`http://localhost:8080/api/estabelecimentos${q2}`);
        if (r2.ok) {
          const d2 = await r2.json();
          setEstablishments(d2 || []);
        }
      } catch (e) {
        // ignore
      }
    } catch (e) {
      console.error('syncLocalToBackend failed overall', e);
    }
  };

  React.useEffect(() => {
    try {
      if (dark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("hs:theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("hs:theme", "light");
      }
    } catch (e) {
      // ignore in SSR or restricted environments
    }
  }, [dark]);

  React.useEffect(() => {
    fetchEstablishments(user);
  }, [user]);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="relative min-h-screen bg-gradient-to-b from-background to-background/40 text-foreground">
        {/* Soft radial glow background */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_0%,hsl(var(--primary)/0.18),transparent_60%)]" />

        <Nav
          dark={dark}
          onToggleDark={() => setDark((v) => !v)}
          onLoginClick={() => setLoginOpen(true)}
          user={user}
          onLogout={() => {
            setUser(null);
            localStorage.removeItem("hs_user");
          }}
          onNavigate={(p) => setPage(p)}
        />

        <LoginModal
          isOpen={loginOpen}
          onClose={() => setLoginOpen(false)}
          onLoggedIn={(u/*, ctx */) => {
            // Não abrir automaticamente o formulário; usuário deve clicar no CTA
            setUser(u);
            setLoginOpen(false);
            setPage("home");
          }}
        />

        {/* Se o usuário não estiver logado mostra a landing pública */}
        {!user ? (
          <>
            <Hero />
            <WaveDivider />
            <FeatureGrid />
            <TabsSection />
            <Pricing />
            <Contact />
            <Footer />
          </>
        ) : (
          // App protegido (Home + páginas internas)
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">HydroSave</h1>
                <p className="text-muted-foreground">Seja bem-vindo, {user.name}!</p>
                <p className="mt-2 text-lg">Monitoramento inteligente de consumo de água</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setPage("home")}>Home</Button>
                <Button onClick={() => setPage("realtime")} variant="outline">Monitoramento</Button>
                <Button onClick={() => setPage("alerts")} variant="outline">Alertas</Button>
                <Button onClick={() => setPage("reports")} variant="outline">Relatórios</Button>
                <Button onClick={() => setPage("tips")} variant="outline">Dicas</Button>
                <Button onClick={() => setShowEstForm(true)} variant="secondary">Adicionar Estabelecimento</Button>
              </div>
            </div>

            {/* Se não tiver estabelecimentos, mostra card chamativo com botão grande */}
            {establishments.length === 0 ? (
              <div className="mb-6">
                <Card className="rounded-2xl border-muted bg-blue-600 text-white p-6">
                  <CardContent>
                    <h2 className="text-2xl font-bold">Comece monitorando seu consumo de água agora mesmo!</h2>
                    <p className="mt-2">Para iniciar, cadastre seu estabelecimento.</p>
                    <div className="mt-4">
                      <Button size="lg" className="bg-white text-blue-700" onClick={() => setShowEstForm(true)}>👉 Cadastre seu Estabelecimento para Começar</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex items-center justify-end">
                  <Button onClick={() => setShowEstForm(true)} size="sm">+ Adicionar Estabelecimento</Button>
                </div>
                <div className="mb-6 grid gap-4 md:grid-cols-2">
                {establishments.map((e) => (
                  <Card key={e.id} className="rounded-2xl">
                    <CardHeader>
                      <CardTitle>{e.nomeEstabelecimento}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">Consumo médio: {e.consumoMedioMensalLitros ?? '-'} L/mês</p>
                      <p className="text-sm">Status: ativo</p>
                      <div className="mt-3">
                        <Button variant="outline" onClick={() => setSelectedEst(e)}>Ver detalhes</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                </div>
              </div>
            )}
{showEstForm && (
<div
  className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950"
  onClick={() => setShowEstForm(false)}
>

    <div
      className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border bg-background text-foreground p-6 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <EstablishmentForm
        user={user}
        onSaved={(saved) => {
          fetchEstablishments(user);
          setShowEstForm(false);
        }}
        onClose={() => setShowEstForm(false)}
      />

      <button
        className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        onClick={() => setShowEstForm(false)}
      >
        ✕
      </button>
    </div>
  </div>
)}
            







            {/* Details modal for selected establishment */}
            {selectedEst && (
              <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 px-4">
                <div className="rounded-2xl border bg-background p-6 shadow-lg">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-semibold">Detalhes do Estabelecimento</h3>
                    <button onClick={() => setSelectedEst(null)} className="text-sm text-muted-foreground">Fechar</button>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div><strong>Nome:</strong> {selectedEst.nomeEstabelecimento}</div>
                    <div><strong>Tipo:</strong> {selectedEst.tipoImovel}</div>
                    <div><strong>Endereço:</strong> {selectedEst.rua}, {selectedEst.numero} - {selectedEst.bairro}, {selectedEst.cidade} / {selectedEst.estado} - CEP {selectedEst.cep}</div>
                    <div><strong>Pessoas:</strong> {selectedEst.pessoasQueUsam}</div>
                    <div><strong>Hidrômetro individual:</strong> {selectedEst.hidrometroIndividual ? 'Sim' : 'Não'}</div>
                    <div><strong>Consumo médio (L/mês):</strong> {selectedEst.consumoMedioMensalLitros}</div>
                    <div><strong>Tem caixa d'água:</strong> {selectedEst.temCaixaDagua ? 'Sim' : 'Não'}</div>
                    {selectedEst.capacidadeCaixaLitros && <div><strong>Capacidade caixa (L):</strong> {selectedEst.capacidadeCaixaLitros}</div>}
                    <div><strong>Receber alertas:</strong> {selectedEst.receberAlertas ? 'Sim' : 'Não'}</div>
                    <div><strong>Limite diário (L):</strong> {selectedEst.limiteMaxDiarioLitros}</div>
                    <div><strong>Ver gráficos:</strong> {selectedEst.verGraficos ? 'Sim' : 'Não'}</div>
                  </div>
                </div>
              </div>
            )}

            <div>
              {page === "home" && (
                <div className="space-y-6">
                  <Card className="rounded-2xl border-muted">
                    <CardHeader>
                      <CardTitle>Painel de Tendências</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DemoPanel />
                    </CardContent>
                  </Card>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="rounded-2xl">
                      <CardHeader>
                        <CardTitle>Avisos importantes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Aqui serão exibidos alertas e relatórios importantes — vazamentos detectados, picos de consumo e recomendações.</p>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                      <CardHeader>
                        <CardTitle>Atalhos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-2">
                          <Button onClick={() => setPage("realtime")} variant="ghost">Monitoramento em tempo real</Button>
                          <Button onClick={() => setPage("alerts")} variant="ghost">Alertas de consumo</Button>
                          <Button onClick={() => setPage("reports")} variant="ghost">Relatórios</Button>
                          <Button onClick={() => setPage("tips")} variant="ghost">Dicas de economia</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {page === "realtime" && (
                <div>
                  <h2 className="text-2xl font-semibold">Monitoramento em Tempo Real</h2>
                  <p className="text-muted-foreground mt-2">Exibe o consumo atual e histórico em gráfico, atualizado automaticamente.</p>
                  <div className="mt-4"><DemoPanel /></div>
                </div>
              )}

              {page === "alerts" && (
                <div>
                  <h2 className="text-2xl font-semibold">Alertas de Consumo</h2>
                  <p className="text-muted-foreground mt-2">Mostra alertas de uso excessivo ou possíveis vazamentos.</p>
                  <div className="mt-4">
                    <Card>
                      <CardContent>
                        <p className="text-sm">Nenhum alerta crítico no momento.</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {page === "reports" && (
  <div>
    <h2 className="text-2xl font-semibold">Relatórios</h2>
    <p className="text-muted-foreground mt-2">
      Gere relatórios semanais e mensais com insights de consumo.
    </p>

    <div className="mt-6 rounded-2xl border bg-background/40 backdrop-blur p-4">
      <table className="w-full text-sm">
        <thead className="text-muted-foreground border-b">
          <tr>
            <th className="py-3 text-left">Tipo</th>
            <th className="py-3 text-left">Descrição</th>
            <th className="py-3 text-left">Status</th>
            <th className="py-3 text-right">Ação</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-b border-muted/30">
            <td className="py-3 font-medium">Semanal</td>
            <td className="text-muted-foreground">
              Relatório com tendências dos últimos 7 dias.
            </td>
            <td>
              <Badge className="bg-green-600/10 text-green-400">Disponível</Badge>
            </td>
            <td className="text-right">
              <Button variant="outline" size="sm" className="rounded-xl">Gerar</Button>
            </td>
          </tr>

          <tr className="border-b border-muted/30">
            <td className="py-3 font-medium">Mensal</td>
            <td className="text-muted-foreground">
              Comparativo entre meses + pico de consumo.
            </td>
            <td>
              <Badge className="bg-yellow-600/10 text-yellow-400">Em desenvolvimento</Badge>
            </td>
            <td className="text-right">
              <Button disabled variant="outline" size="sm" className="rounded-xl opacity-60">
                Em breve
              </Button>
            </td>
          </tr>

          <tr>
            <td className="py-3 font-medium">Exportação CSV/API</td>
            <td className="text-muted-foreground">
              Exportação de todos os dados para auditoria.
            </td>
            <td>
              <Badge className="bg-blue-600/10 text-blue-400">Planejado</Badge>
            </td>
            <td className="text-right">
              <Button disabled size="sm" className="rounded-xl">
                🚧
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)}


              {page === "tips" && (
  <div>
    <h2 className="text-2xl font-semibold">Guia Corporativo de Economia de Água</h2>
    <p className="text-muted-foreground mt-2">
      Práticas estratégicas para otimizar o consumo de água em ambientes residenciais e corporativos.
    </p>

    <div className="grid gap-4 mt-6 md:grid-cols-2">
      {/* --- Card 1: Vazamentos --- */}
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-primary" />
          <CardTitle>Correção Imediata de Vazamentos</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Vazamentos representam perdas contínuas que aumentam custos e riscos
          estruturais. Estabeleça rotinas de inspeção e reparos rápidos.
          <div className="mt-4">
            <p className="font-medium text-foreground">Impacto estimado:</p>
            <div className="w-full bg-muted h-2 rounded-full mt-1">
              <div className="bg-primary h-2 rounded-full w-[85%]"></div>
            </div>
            <p className="text-xs mt-1">Até 85% de economia quando resolvido imediatamente.</p>
          </div>
        </CardContent>
      </Card>

      {/* --- Card 2: Arejadores --- */}
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center gap-3">
          <Droplet className="h-8 w-8 text-primary" />
          <CardTitle>Tecnologias Economizadoras</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Utilize arejadores, redutores de vazão e equipamentos inteligentes
          para diminuir o consumo sem afetar o desempenho.
          <div className="mt-4">
            <p className="font-medium text-foreground">Redução média:</p>
            <div className="w-full bg-muted h-2 rounded-full mt-1">
              <div className="bg-primary h-2 rounded-full w-[60%]"></div>
            </div>
            <p className="text-xs mt-1">Economia de até 60% no uso diário.</p>
          </div>
        </CardContent>
      </Card>

      {/* --- Card 3: Tempo de Banho --- */}
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center gap-3">
          <Gauge className="h-8 w-8 text-primary" />
          <CardTitle>Otimização do Tempo de Uso</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Reduzir o tempo de banho e uso contínuo de torneiras diminui o consumo
          sem comprometer a rotina.
          <div className="mt-4">
            <p className="font-medium text-foreground">Consumo por minuto:</p>
            <div className="w-full bg-muted h-2 rounded-full mt-1">
              <div className="bg-primary h-2 rounded-full w-[40%]"></div>
            </div>
            <p className="text-xs mt-1">Banhos curtos podem reduzir 40% do gasto.</p>
          </div>
        </CardContent>
      </Card>

      {/* --- Card 4: Reaproveitamento --- */}
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center gap-3">
          <Leaf className="h-8 w-8 text-primary" />
          <CardTitle>Reaproveitamento de Água</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Utilize água de chuva ou água cinza para limpeza, irrigação e outros
          usos não potáveis.
          <div className="mt-4">
            <p className="font-medium text-foreground">Potencial de redução:</p>
            <div className="w-full bg-muted h-2 rounded-full mt-1">
              <div className="bg-primary h-2 rounded-full w-[70%]"></div>
            </div>
            <p className="text-xs mt-1">Redução de até 70% em atividades secundárias.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
)}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Tailwind helper para o input range (global.css):
// .range { @apply h-2 rounded-full bg-muted outline-none; }
// .range::-webkit-slider-thumb { @apply h-4 w-4 rounded-full bg-primary; appearance: none; margin-top: -6px; }
// .range::-moz-range-thumb { height: 16px; width: 16px; border-radius: 9999px; background: hsl(var(--primary)); }
