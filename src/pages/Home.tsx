import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Brain,
  Sparkles,
  Search,
  Shield,
  MessageSquare,
  Zap,
  Clock,
  ChevronRight,
  LogOut,
  LogIn,
  History,
  Users,
  GitMerge,
  AlertTriangle,
  Scale,
  CheckCircle2,
  Scroll,
} from "lucide-react";

const AGENTS = [
  { id: "data_analyst", name: "Dr. Clara Weber", role: "Leitende Datenanalystin", field: "Quantitative Analyse", color: "#3b82f6", desc: "Sachlich, präzise, zahlengetrieben", expertise: ["Statistische Modellierung", "Bayesianische Inferenz", "Monte-Carlo"] },
  { id: "tech_visionary", name: "Max Chen", role: "Chief Technology Futurist", field: "Technologie & Innovation", color: "#8b5cf6", desc: "Exponentialdenker, disruptiv", expertise: ["S-Kurven-Analyse", "Plattformökonomie", "Emergente Tech"] },
  { id: "skeptic", name: "Prof. Karl Braun", role: "Direktor Wissenschaftsethik", field: "Wissenschaftsphilosophie", color: "#ef4444", desc: "Unbeugsam methodenkritisch", expertise: ["Publikationsbias", "False-Positive-Detektion", "Hype-Zyklus"] },
  { id: "strategist", name: "Sarah Müller", role: "Senior Unternehmensstrategin", field: "Wirtschaft & Strategie", color: "#10b981", desc: "ROI-orientiert, pragmatisch", expertise: ["Marktanalyse", "Wettbewerbsstrategie", "Risk-Management"] },
  { id: "sociologist", name: "Dr. Amara Okafor", role: "Professorin Sozialforschung", field: "Gesellschaft & Kultur", color: "#f59e0b", desc: "Empathisch-analytisch", expertise: ["Soziodemografie", "Adoptionspsychologie", "Gerechtigkeit"] },
  { id: "systems_thinker", name: "Leo Nakamura", role: "Chief Systems Architect", field: "Systemtheorie & Komplexität", color: "#ec4899", desc: "Holistisch, Second-Order-Effects", expertise: ["Systemdynamik", "Netzwerktheorie", "Resilienz"] },
  { id: "economist", name: "Dr. James Thornton", role: "Chefökonom", field: "Volkswirtschaft", color: "#06b6d4", desc: "Datengetrieben, monetär denkend", expertise: ["Makroökonomik", "Verhaltensökonomik", "Spieltheorie"] },
  { id: "regulatory", name: "Elena Rossi", role: "Leiterin Regulatorische Strategie", field: "Regulierung & Governance", color: "#f97316", desc: "Prozess-orientiert, regulatorisch", expertise: ["Internationales Recht", "Policy-Analyse", "Compliance"] },
  { id: "psychologist", name: "Dr. Yuki Tanaka", role: "Verhaltenspsychologin", field: "Psychologie & Verhalten", color: "#14b8a6", desc: "Sieht kognitive Verzerrungen", expertise: ["Verhaltenspsychologie", "Gruppendynamik", "Entscheidungstheorie"] },
  { id: "security", name: "Marcus Okafor", role: "Chief Risk Officer", field: "Sicherheit & Risiko", color: "#dc2626", desc: "Paranoid im positiven Sinne", expertise: ["Bedrohungsanalyse", "Red-Teaming", "Szenarioplanning"] },
  { id: "historian", name: "Prof. Anna Lindqvist", role: "Dozentin Geschichtswissenschaft", field: "Historische Analyse", color: "#a855f7", desc: "Rhyme of History", expertise: ["Technikgeschichte", "Zivilisationsanalyse", "Langzeitzyklen"] },
  { id: "ethicist", name: "Dr. Priya Sharma", role: "Ethikkommissionsvorsitzende", field: "Ethik & Philosophie", color: "#eab308", desc: "Unkompromissell ethisch", expertise: ["Angewandte Ethik", "Utilitarismus", "Moralphilosophie"] },
];

const PHASES = [
  { icon: Search, label: "Erstanalyse", desc: "Jeder Experte liefert seine initiale fundierte Analyse", round: 1 },
  { icon: Sparkles, label: "Szenarienentwicklung", desc: "Alle denkbaren Zukunftsszenarien werden entwickelt", round: 1 },
  { icon: Shield, label: "Methodenkritik", desc: "Jede Analyse wird auf Stichhaltigkeit geprüft", round: 2 },
  { icon: MessageSquare, label: "Kontroverse Debatte", desc: "Gezielte Widersprüche und Gegenpositionen", round: 2 },
  { icon: AlertTriangle, label: "Antithese", desc: "Konstruktion des stärksten Gegenarguments", round: 3 },
  { icon: GitMerge, label: "Synthese", desc: "Auflösung von Widersprüchen", round: 3 },
  { icon: Zap, label: "Stresstest", desc: "Extrembedingungen auf Belastbarkeit", round: 4 },
  { icon: Scale, label: "Konsensfindung", desc: "Iterative Annäherung bis alle kompatibel", round: 4 },
  { icon: CheckCircle2, label: "Validierung", desc: "Finale Konsistenzprüfung", round: 5 },
  { icon: Scroll, label: "Vorhersage", desc: "Nur bei ausreichendem Konsens", round: 5 },
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const createSession = trpc.thinkTank.createSession.useMutation();
  const { data: sessions } = trpc.thinkTank.listSessions.useQuery(undefined, { enabled: !!user });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !user) return;
    setIsSubmitting(true);
    try {
      const result = await createSession.mutateAsync({ topic: topic.trim() });
      navigate(`/session/${result.sessionId}`);
    } catch (err) {
      console.error(err);
      alert("Fehler beim Starten der Session");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">Futura Think Tank</h1>
              <p className="text-xs text-muted-foreground">Deep Future Analysis — Konsens-basiert, Multi-Runden, 12 Experten</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{user.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => window.location.href = "/login"}>
                <LogIn className="w-4 h-4 mr-2" />
                Anmelden
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-20">
        {/* Hero */}
        <section className="text-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Badge variant="outline" className="px-3 py-1 text-xs border-primary/30 text-primary">
                <Clock className="w-3 h-3 mr-1" />
                5-Runden-Tiefenanalyse
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-xs border-emerald-500/30 text-emerald-400">
                <Users className="w-3 h-3 mr-1" />
                12 Disziplinen
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-xs border-amber-500/30 text-amber-400">
                <Scale className="w-3 h-3 mr-1" />
                Konsens-gesteuert
              </Badge>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Wie denkt die Zukunft — wirklich?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Unser Think Tank aus <strong>12 unabhängigen Experten</strong> aus verschiedenen Fachdisziplinen 
              durchläuft <strong>5 Analyse-Runden</strong>: Analyse, Debatte, Antithese, Stresstest und 
              Konsensfindung. Nur bei ausreichender Einigung wird eine Vorhersage ausgegeben.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
              <div className="relative flex gap-2 p-2 bg-card border border-border rounded-2xl shadow-xl">
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Stellen Sie Ihre Zukunftsfrage... (z.B. 'Wie wird KI die Bildung verändern?')"
                  className="flex-1 border-0 bg-transparent text-lg placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isSubmitting || !user}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting || !topic.trim() || !user}
                  className="rounded-xl px-6 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Analysiere...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Starten
                    </>
                  )}
                </Button>
              </div>
            </div>
            {!user && (
              <p className="mt-3 text-sm text-muted-foreground">
                Melden Sie sich an, um eine Tiefenanalyse zu starten
              </p>
            )}
          </form>
        </section>

        {/* Past Sessions */}
        {user && sessions && sessions.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">Ihre Analysen</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((session) => (
                <Card
                  key={session.id}
                  className="cursor-pointer hover:border-primary/40 transition-colors group"
                  onClick={() => navigate(`/session/${session.id}`)}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {session.topic}
                      </h4>
                      <ChevronRight className="w-4 h-4 text-muted-foreground mt-1" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      <Badge 
                        variant={session.status === "completed" ? "default" : session.status === "insufficient_consensus" ? "destructive" : "secondary"} 
                        className="text-xs"
                      >
                        {session.status === "completed" ? "Konsens erreicht" : session.status === "insufficient_consensus" ? "Kein Konsens" : "Läuft"}
                      </Badge>
                      <span>{new Date(session.createdAt).toLocaleDateString("de-DE")}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Agents */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="text-2xl font-bold">Die 12 Experten</h3>
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Zwölf unabhängige Disziplinen. Keine einzelne Perspektive dominiert. 
              Jeder Experte bringt spezifisches Fachwissen und methodische Strenge ein.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {AGENTS.map((agent) => (
              <Card key={agent.id} className="border-border/60 hover:border-primary/30 transition-colors">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2" style={{ borderColor: agent.color }}>
                      <AvatarFallback style={{ backgroundColor: agent.color + "20", color: agent.color, fontSize: "0.65rem" }}>
                        {agent.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm truncate">{agent.name}</h4>
                      <p className="text-xs text-muted-foreground">{agent.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{agent.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.expertise.map((exp, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0.5">{exp}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold">Der 5-Runden-Prozess</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Keine oberflächliche Einmal-Analyse. Fünf iterative Runden mit zunehmender Tiefe, 
              bis ein qualifizierter Konsens erreicht ist — oder explizit festgestellt wird, 
              dass die Unsicherheit zu hoch ist.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((round) => {
              const roundPhases = PHASES.filter(p => p.round === round);
              return (
                <Card key={round} className="border-border/60">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Runde {round}</Badge>
                    </div>
                    <div className="space-y-3">
                      {roundPhases.map((phase, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <phase.icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{phase.label}</p>
                            <p className="text-xs text-muted-foreground">{phase.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Trust indicators */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border/60 bg-gradient-to-br from-blue-500/5 to-transparent">
            <CardContent className="p-5 space-y-2 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto" />
              <h4 className="font-semibold">12 Disziplinen</h4>
              <p className="text-sm text-muted-foreground">Von Datenanalyse über Ethik bis zu historischer Analyse</p>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-gradient-to-br from-emerald-500/5 to-transparent">
            <CardContent className="p-5 space-y-2 text-center">
              <Scale className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-semibold">Konsens-gesteuert</h4>
              <p className="text-sm text-muted-foreground">Keine Ausgabe ohne ausreichende Einigung. Qualität vor Geschwindigkeit.</p>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-gradient-to-br from-violet-500/5 to-transparent">
            <CardContent className="p-5 space-y-2 text-center">
              <Shield className="w-8 h-8 text-violet-400 mx-auto" />
              <h4 className="font-semibold">5 Analyse-Runden</h4>
              <p className="text-sm text-muted-foreground">Erstanalyse → Debatte → Antithese/Synthese → Stresstest → Konsens</p>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/40 pt-8 text-center text-sm text-muted-foreground space-y-2">
          <p>Futura Think Tank — Wo zwölf Disziplinen gemeinsam die Zukunft denken.</p>
          <p>Deep Multi-Round Consensus Analysis Engine</p>
        </footer>
      </main>
    </div>
  );
}
