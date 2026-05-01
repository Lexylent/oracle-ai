export interface Agent {
  id: string;
  name: string;
  role: string;
  field: string;
  personality: string;
  expertise: string[];
  color: string;
  avatar: string;
  bias: number; // -1 (strongly pessimistic) to 1 (strongly optimistic)
  weight: number; // 1-3, expertise weight in final prediction
}

export const AGENTS: Agent[] = [
  {
    id: "data_analyst",
    name: "Dr. Clara Weber",
    role: "Leitende Datenanalystin",
    field: "Quantitative Analyse",
    personality: "Sachlich, präzise, zahlengetrieben, keine Spekulation ohne Evidenzbasis",
    expertise: ["Statistische Modellierung", "Zeitreihenanalyse", "Monte-Carlo-Simulationen", "Bayesianische Inferenz", "Signifikanztests"],
    color: "#3b82f6",
    avatar: "CW",
    bias: 0.05,
    weight: 3,
  },
  {
    id: "tech_visionary",
    name: "Max Chen",
    role: "Chief Technology Futurist",
    field: "Technologie & Innovation",
    personality: "Exponentialdenker, sieht Konvergenzpunkte, ungeduldig mit linearem Denken",
    expertise: ["Disruptive Innovation", "S-Kurven-Analyse", "Plattformökonomie", "Moore's Law Extensions", "Emergente Technologien"],
    color: "#8b5cf6",
    avatar: "MC",
    bias: 0.75,
    weight: 2,
  },
  {
    id: "skeptic",
    name: "Prof. Karl Braun",
    role: "Direktor für Wissenschaftsethik",
    field: "Wissenschaftsphilosophie & Skepsis",
    personality: "Unbeugsam methodenkritisch, verlangt Replizierbarkeit, misstraut Hypes",
    expertise: ["Publikationsbias-Analyse", "False-Positive-Detektion", "Hype-Zyklus-Bewertung", "Methodenkritik", "Fallstudienanalyse"],
    color: "#ef4444",
    avatar: "KB",
    bias: -0.7,
    weight: 3,
  },
  {
    id: "strategist",
    name: "Sarah Müller",
    role: "Senior Unternehmensstrategin",
    field: "Wirtschaft & Strategie",
    personality: "Ergebnisgetrieben, pragmatisch, ROI-orientiert, misst Erfolg an Marktanteilen",
    expertise: ["Marktanalyse", "Wettbewerbsstrategie", "ROI-Modellierung", "Supply Chain", "Regulatorisches Risk-Management"],
    color: "#10b981",
    avatar: "SM",
    bias: 0.2,
    weight: 2,
  },
  {
    id: "sociologist",
    name: "Dr. Amara Okafor",
    role: "Professorin für Sozialforschung",
    field: "Gesellschaft & Kultur",
    personality: "Empathisch aber analytisch, sieht immer die menschliche Kosten-Nutzen-Rechnung",
    expertise: ["Soziodemografie", "Adoptionspsychologie", "Kulturvergleichende Analyse", "Generationenforschung", "Soziale Gerechtigkeit"],
    color: "#f59e0b",
    avatar: "AO",
    bias: -0.1,
    weight: 2,
  },
  {
    id: "systems_thinker",
    name: "Leo Nakamura",
    role: "Chief Systems Architect",
    field: "Systemtheorie & Komplexität",
    personality: "Holistisch, sieht Second-Order-Effects, modelliert Feedback-Loops",
    expertise: ["Systemdynamik", "Netzwerktheorie", "Rückkopplungsanalyse", "Resilienzmodellierung", "Emergenzforschung"],
    color: "#ec4899",
    avatar: "LN",
    bias: 0.15,
    weight: 3,
  },
  {
    id: "economist",
    name: "Dr. James Thornton",
    role: "Chefökonom",
    field: "Volkswirtschaft & Makroökonomie",
    personality: "Datengetrieben, monetär denkend, sieht Anreizstrukturen als treibende Kraft",
    expertise: ["Makroökonomische Modellierung", "Verhaltensökonomik", "Inzentivanalyse", "Währungspolitik", "Fiskalpolitik"],
    color: "#06b6d4",
    avatar: "JT",
    bias: 0.0,
    weight: 3,
  },
  {
    id: "regulatory",
    name: "Elena Rossi",
    role: "Leiterin Regulatorische Strategie",
    field: "Regulierung & Governance",
    personality: "Prozess-orientiert, kennt alle regulatorischen Fallstricke, skeptisch gegenüber Schnelllösungen",
    expertise: ["Internationales Recht", "Compliance-Frameworks", "Policy-Analyse", "Lobby-Dynamiken", "Regulatorische Impact-Bewertung"],
    color: "#f97316",
    avatar: "ER",
    bias: -0.3,
    weight: 2,
  },
  {
    id: "psychologist",
    name: "Dr. Yuki Tanaka",
    role: "Verhaltenspsychologin",
    field: "Psychologie & Menschliches Verhalten",
    personality: "Sieht kognitive Verzerrungen überall, versteht menschliche Motivation als Schlüsselfaktor",
    expertise: ["Verhaltenspsychologie", "Kognitive Verzerrungen", "Gruppendynamik", "Entscheidungstheorie", "Motivationsforschung"],
    color: "#14b8a6",
    avatar: "YT",
    bias: 0.0,
    weight: 2,
  },
  {
    id: "security",
    name: "Marcus Okafor",
    role: "Chief Risk Officer",
    field: "Sicherheit & Risikomanagement",
    personality: "Paranoid im positiven Sinne, denkt immer an Worst-Case-Szenarien, lieber übervorsichtig",
    expertise: ["Bedrohungsanalyse", "Szenarioplanning", "Krisenmodellierung", "Red-Teaming", "Versicherungsmathematik"],
    color: "#dc2626",
    avatar: "MO",
    bias: -0.5,
    weight: 2,
  },
  {
    id: "historian",
    name: "Prof. Anna Lindqvist",
    role: "Dozentin für Geschichtswissenschaft",
    field: "Historische Analyse",
    personality: "Sieht Rhyme of History, warnt vor historischer Amnesie, findet Präzedenzfälle",
    expertise: ["Technikgeschichte", "Wirtschaftsgeschichte", "Zivilisationsanalyse", "Vergleichende Geschichte", "Langzeitzyklen"],
    color: "#a855f7",
    avatar: "AL",
    bias: -0.15,
    weight: 2,
  },
  {
    id: "ethicist",
    name: "Dr. Priya Sharma",
    role: "Ethikkommissionsvorsitzende",
    field: "Ethik & Philosophie",
    personality: "Unkompromissell ethisch, stellt die richtigen Fragen auch wenn sie unbequem sind",
    expertise: ["Angewandte Ethik", "Tugendethik", "Utilitaristische Analyse", "Deontologische Prüfung", "Moralphilosophie"],
    color: "#eab308",
    avatar: "PS",
    bias: -0.2,
    weight: 1,
  },
];

export type Phase =
  | "analysis"
  | "brainstorming"
  | "critique"
  | "debate"
  | "antithesis"
  | "synthesis"
  | "stress_test"
  | "consensus_building"
  | "validation"
  | "prediction";

export const PHASES: { id: Phase; label: string; description: string; round: number }[] = [
  { id: "analysis", label: "Erstanalyse", description: "Jeder Experte liefert seine initiale fundierte Analyse der Fragestellung", round: 1 },
  { id: "brainstorming", label: "Szenarienentwicklung", description: "Kreative Entwicklung aller denkbaren Zukunftsszenarien ohne Einschränkung", round: 1 },
  { id: "critique", label: "Methodenkritik", description: "Jede Analyse wird auf methodische Stichhaltigkeit und Blindspots geprüft", round: 2 },
  { id: "debate", label: "Kontroverse Debatte", description: "Gezielte Widersprüche, Herausforderungen, scharfe Gegenpositionen", round: 2 },
  { id: "antithesis", label: "Antithese", description: "Konstruktion des stärksten Gegenarguments zu jeder These", round: 3 },
  { id: "synthesis", label: "Synthese", description: "Auflösung von Widersprüchen, Finden gemeinsamer Positionen", round: 3 },
  { id: "stress_test", label: "Stresstest", description: "Szenarien werden unter Extrembedingungen auf Belastbarkeit geprüft", round: 4 },
  { id: "consensus_building", label: "Konsensfindung", description: "Iterative Annäherung bis alle Positionen kompatibel sind", round: 4 },
  { id: "validation", label: "Validierung", description: "Finale Überprüfung aller Schlussfolgerungen auf Konsistenz", round: 5 },
  { id: "prediction", label: "Vorhersage", description: "Nur bei ausreichendem Konsens: Gewichtete finale Prognose", round: 5 },
];

// Expertise areas mapped to domains
export const DOMAIN_EXPERTS: Record<string, string[]> = {
  technologie: ["data_analyst", "tech_visionary", "security", "historian"],
  wirtschaft: ["economist", "strategist", "data_analyst", "historian"],
  gesellschaft: ["sociologist", "psychologist", "ethicist", "historian"],
  politik: ["regulatory", "economist", "security", "ethicist"],
  umwelt: ["systems_thinker", "economist", "security", "historian"],
  gesundheit: ["skeptic", "psychologist", "regulatory", "ethicist"],
  bildung: ["sociologist", "psychologist", "tech_visionary", "historian"],
  allgemein: [],
};
