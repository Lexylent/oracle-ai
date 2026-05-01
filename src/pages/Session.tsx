import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Brain,
  Search,
  Sparkles,
  Shield,
  MessageSquare,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  GitMerge,
  Scale,
  Scroll,
  XCircle,
  Users,
  BarChart3,
  Info,
} from "lucide-react";

const PHASE_CONFIG = [
  { id: "analysis", label: "Erstanalyse", icon: Search, color: "from-blue-500 to-blue-600", round: 1 },
  { id: "brainstorming", label: "Szenarien", icon: Sparkles, color: "from-violet-500 to-violet-600", round: 1 },
  { id: "critique", label: "Kritik", icon: Shield, color: "from-red-500 to-red-600", round: 2 },
  { id: "debate", label: "Debatte", icon: MessageSquare, color: "from-amber-500 to-amber-600", round: 2 },
  { id: "antithesis", label: "Antithese", icon: AlertTriangle, color: "from-orange-500 to-orange-600", round: 3 },
  { id: "synthesis", label: "Synthese", icon: GitMerge, color: "from-pink-500 to-pink-600", round: 3 },
  { id: "stress_test", label: "Stresstest", icon: Zap, color: "from-emerald-500 to-emerald-600", round: 4 },
  { id: "consensus_building", label: "Konsens", icon: Scale, color: "from-cyan-500 to-cyan-600", round: 4 },
  { id: "validation", label: "Validierung", icon: CheckCircle2, color: "from-teal-500 to-teal-600", round: 5 },
  { id: "prediction", label: "Vorhersage", icon: Scroll, color: "from-indigo-500 to-indigo-600", round: 5 },
];

const SENTIMENT_STYLES: Record<string, { border: string; bg: string; label: string; icon: typeof CheckCircle2 }> = {
  positive: { border: "border-emerald-500/30", bg: "bg-emerald-500/10", label: "Positiv", icon: CheckCircle2 },
  negative: { border: "border-red-500/30", bg: "bg-red-500/10", label: "Kritisch", icon: XCircle },
  neutral: { border: "border-blue-500/30", bg: "bg-blue-500/10", label: "Neutral", icon: Info },
  concerned: { border: "border-amber-500/30", bg: "bg-amber-500/10", label: "Besorgt", icon: AlertTriangle },
  excited: { border: "border-violet-500/30", bg: "bg-violet-500/10", label: "Enthusiastisch", icon: Sparkles },
};

export default function Session() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sessionId = parseInt(id || "0");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [displayedCount, setDisplayedCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [expandedResults, setExpandedResults] = useState(false);
  const [expandedDissent, setExpandedDissent] = useState(false);

  const { data, isLoading } = trpc.thinkTank.getSession.useQuery({ id: sessionId }, {
    enabled: sessionId > 0,
  });

  const messages = data?.messages || [];
  const agents = data?.agents || [];
  const outcomes = data?.outcomes || [];
  const session = data?.session;

  // Auto-play messages
  useEffect(() => {
    if (!isPlaying || displayedCount >= messages.length) {
      if (displayedCount >= messages.length && messages.length > 0) {
        setShowResults(true);
      }
      return;
    }

    const currentPhase = messages[displayedCount]?.phase;
    const phaseConfig = PHASE_CONFIG.find(p => p.id === currentPhase);
    const isDeepPhase = phaseConfig && (phaseConfig.id === "debate" || phaseConfig.id === "consensus_building" || phaseConfig.id === "synthesis");
    const delay = isDeepPhase ? 2000 : 1400;

    const timer = setTimeout(() => {
      setDisplayedCount((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [displayedCount, isPlaying, messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedCount]);

  const displayedMessages = messages.slice(0, displayedCount);
  const currentPhase = messages[displayedCount]?.phase || (messages.length > 0 ? messages[messages.length - 1].phase : "analysis");
  const currentPhaseConfig = PHASE_CONFIG.find((p) => p.id === currentPhase);
  const currentPhaseIndex = PHASE_CONFIG.findIndex((p) => p.id === currentPhase);
  const progress = messages.length > 0 ? (displayedCount / messages.length) * 100 : 0;
  const currentRound = currentPhaseConfig?.round || 1;

  const getAgent = (agentId: string) => agents.find((a) => a.id === agentId);

  const handleRestart = () => {
    setDisplayedCount(0);
    setIsPlaying(true);
    setShowResults(false);
    setExpandedResults(false);
    setExpandedDissent(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Brain className="w-8 h-8 animate-pulse text-primary mx-auto" />
          <p className="text-muted-foreground">Lade Think Tank Session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <p className="text-muted-foreground">Session nicht gefunden</p>
            <Button onClick={() => navigate("/")}>Zurück zur Startseite</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const outcome = outcomes[0];
  const hasConsensus = outcome ? outcome.consensusLevel >= outcome.consensusRequired : true;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/90">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-bold text-sm sm:text-base line-clamp-1">{session.topic}</h1>
              <p className="text-xs text-muted-foreground">
                Think Tank Session #{session.id} · {messages.length} Beiträge · {agents.length} Experten
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleRestart}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            {!isPlaying && displayedCount < messages.length && (
              <Button size="sm" onClick={() => setIsPlaying(true)}>
                Fortsetzen
              </Button>
            )}
            {isPlaying && displayedCount < messages.length && (
              <Button variant="ghost" size="sm" onClick={() => setIsPlaying(false)}>
                Pause
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Phase Progress */}
        <Card className="border-border/60">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className={`bg-gradient-to-r ${currentPhaseConfig?.color || "from-blue-500 to-blue-600"} text-white`}>
                  Runde {currentRound}
                </Badge>
                <span className="text-sm font-medium">{currentPhaseConfig?.label}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {displayedCount} / {messages.length} Beiträge
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex flex-wrap gap-1.5">
              {PHASE_CONFIG.map((phase, i) => {
                const isActive = i === currentPhaseIndex;
                const isPast = i < currentPhaseIndex;
                return (
                  <div
                    key={phase.id}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                      isActive
                        ? `bg-gradient-to-r ${phase.color} text-white shadow-md`
                        : isPast
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <phase.icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{phase.label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Agents Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Experten-Panel ({agents.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {agents.map((agent) => {
                  const isActive = displayedMessages.some((m) => m.agentId === agent.id && m.phase === currentPhase);
                  const msgCount = displayedMessages.filter(m => m.agentId === agent.id).length;
                  return (
                    <div
                      key={agent.id}
                      className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${
                        isActive ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-muted/50"
                      }`}
                    >
                      <Avatar className="w-8 h-8 border-2 shrink-0" style={{ borderColor: agent.color }}>
                        <AvatarFallback
                          className="text-[10px] font-bold"
                          style={{ backgroundColor: agent.color + "20", color: agent.color }}
                        >
                          {agent.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{agent.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{agent.role}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {msgCount > 0 && (
                          <span className="text-[10px] text-muted-foreground">{msgCount}</span>
                        )}
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Session Stats */}
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Session-Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge 
                    variant={session.status === "completed" ? "default" : session.status === "insufficient_consensus" ? "destructive" : "secondary"}
                    className="text-[10px]"
                  >
                    {session.status === "completed" ? "Konsens" : session.status === "insufficient_consensus" ? "Kein Konsens" : "Analyse"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Beiträge</span>
                  <span className="font-medium">{messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experten</span>
                  <span className="font-medium">{agents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phasen</span>
                  <span className="font-medium">{new Set(messages.map(m => m.phase)).size} / {PHASE_CONFIG.length}</span>
                </div>
                {outcome && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Konsens-Level</span>
                      <span className={`font-medium ${outcome.consensusLevel >= outcome.consensusRequired ? "text-emerald-400" : "text-red-400"}`}>
                        {outcome.consensusLevel}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Erforderlich</span>
                      <span className="font-medium">{outcome.consensusRequired}%</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Discussion */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Diskussions-Log
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[550px] px-4 pb-4" ref={scrollRef}>
                  <div className="space-y-3 pt-2">
                    {displayedMessages.map((msg, idx) => {
                      const agent = getAgent(msg.agentId);
                      const sentiment = SENTIMENT_STYLES[msg.sentiment || "neutral"] || SENTIMENT_STYLES.neutral;
                      const SentimentIcon = sentiment.icon;
                      const isReply = msg.replyToId != null;
                      const isHighlight = msg.isHighlight === "true";

                      return (
                        <div
                          key={msg.id}
                          className={`animate-slide-up ${isReply ? "pl-6 border-l-2 border-border ml-4" : ""} ${isHighlight ? "ring-1 ring-primary/20 rounded-lg p-2 bg-primary/5" : ""}`}
                          style={{ animationDelay: `${Math.min(idx * 0.03, 0.5)}s` }}
                        >
                          <div className="flex gap-2.5">
                            <Avatar className="w-8 h-8 mt-0.5 border-2 shrink-0" style={{ borderColor: agent?.color || "#888" }}>
                              <AvatarFallback
                                className="text-[10px] font-bold"
                                style={{
                                  backgroundColor: (agent?.color || "#888") + "20",
                                  color: agent?.color || "#888",
                                }}
                              >
                                {agent?.avatar || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-semibold">{agent?.name || "Unbekannt"}</span>
                                <span className="text-[10px] text-muted-foreground">{agent?.field}</span>
                                <Badge variant="outline" className={`text-[9px] px-1 py-0 ${sentiment.border} ${sentiment.bg}`}>
                                  <SentimentIcon className="w-2.5 h-2.5 mr-0.5" />
                                  {sentiment.label}
                                </Badge>
                                {isHighlight && (
                                  <Badge className="text-[9px] px-1 py-0 bg-primary/20 text-primary">
                                    Wichtig
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-foreground/90 leading-relaxed bg-muted/30 rounded-lg p-2.5">
                                {msg.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {isPlaying && displayedCount < messages.length && (
                      <div className="flex items-center gap-3 animate-fade-in px-2">
                        <Avatar className="w-8 h-8 border-2 border-primary/50">
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px] animate-pulse">
                            ...
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <span className="text-xs">{getAgent(messages[displayedCount]?.agentId)?.name || "Experte"}</span>
                          <span className="text-xs text-muted-foreground/60">analysiert...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar - Phases & Info */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Phasen-Tracker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {PHASE_CONFIG.map((phase, i) => {
                  const isActive = i === currentPhaseIndex;
                  const isPast = i < currentPhaseIndex;
                  const phaseMsgCount = messages.filter(m => m.phase === phase.id).length;
                  return (
                    <div key={phase.id} className={`flex items-center gap-2 p-1.5 rounded ${isActive ? "bg-primary/10" : ""}`}>
                      <phase.icon className={`w-3.5 h-3.5 ${isPast ? "text-primary" : isActive ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-xs flex-1 ${isPast ? "text-primary" : isActive ? "font-medium" : "text-muted-foreground"}`}>
                        {phase.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{phaseMsgCount}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Results */}
        {showResults && outcome && (
          <div className="animate-fade-in space-y-4">
            {/* Consensus Banner */}
            {!hasConsensus && (
              <Card className="border-red-500/30 bg-red-500/5">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-6 h-6 text-red-400" />
                    <div>
                      <h3 className="font-bold text-red-400">Kein ausreichender Konsens erreicht</h3>
                      <p className="text-sm text-muted-foreground">
                        Konsens-Rate: {outcome.consensusLevel}% (Erforderlich: {outcome.consensusRequired}%)
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {outcome.reasoning}
                  </p>
                  {outcome.dissentingViews && outcome.dissentingViews.length > 0 && (
                    <div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setExpandedDissent(!expandedDissent)}
                        className="text-xs"
                      >
                        {expandedDissent ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                        Dissens-Positionen ({outcome.dissentingViews.length})
                      </Button>
                      {expandedDissent && (
                        <ul className="mt-2 space-y-2 animate-slide-up">
                          {outcome.dissentingViews.map((view, i) => (
                            <li key={i} className="text-sm text-red-300/80 flex items-start gap-2">
                              <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                              {view}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Main Prediction Card */}
            <Card className={`border-l-4 ${hasConsensus ? "border-l-primary" : "border-l-amber-500"}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    {hasConsensus ? "Zukunftsprognose" : "Vorläufige Einschätzung"}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setExpandedResults(!expandedResults)}>
                    {expandedResults ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{outcome.scenario}</h3>
                  <p className="text-sm text-muted-foreground">{outcome.reasoning}</p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-3 text-center space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Wahrscheinlichkeit</p>
                      <p className="text-2xl font-bold text-primary">{outcome.probability}%</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-emerald-500/5 border-emerald-500/20">
                    <CardContent className="p-3 text-center space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Konfidenz</p>
                      <p className="text-2xl font-bold text-emerald-400">{outcome.confidence}%</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-violet-500/5 border-violet-500/20">
                    <CardContent className="p-3 text-center space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Zeithorizont</p>
                      <p className="text-lg font-bold text-violet-400">{outcome.timeframe}</p>
                    </CardContent>
                  </Card>
                  <Card className={`${hasConsensus ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}>
                    <CardContent className="p-3 text-center space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Konsens</p>
                      <p className={`text-2xl font-bold ${hasConsensus ? "text-emerald-400" : "text-red-400"}`}>
                        {outcome.consensusLevel}%
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Alternative Scenarios */}
                {outcome.alternativeScenarios && outcome.alternativeScenarios.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground">Alternative Szenarien</h4>
                    <div className="space-y-2">
                      {outcome.alternativeScenarios.map((alt, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg p-2.5">
                          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                          {alt}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expanded Details */}
                {expandedResults && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up">
                    <Card className="border-red-500/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-red-400">
                          <AlertTriangle className="w-4 h-4" />
                          Risiken ({outcome.risks?.length || 0})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {outcome.risks?.map((risk, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-red-400 mt-1">•</span>
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="border-emerald-500/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          Chancen ({outcome.opportunities?.length || 0})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {outcome.opportunities?.map((opp, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-emerald-400 mt-1">•</span>
                              {opp}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 pb-8">
              <Button variant="outline" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Neue Analyse
              </Button>
              <Button onClick={handleRestart}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Wiedergeben
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
