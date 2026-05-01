import { AGENTS, type Agent, type Phase } from "./agents";

export interface EngineMessage {
  agentId: string;
  phase: Phase;
  content: string;
  sentiment: "positive" | "negative" | "neutral" | "concerned" | "excited";
  replyToAgentId?: string;
  isHighlight?: boolean;
}

export interface PredictionResult {
  scenario: string;
  probability: number;
  confidence: number;
  timeframe: string;
  reasoning: string;
  risks: string[];
  opportunities: string[];
  consensusLevel: number; // 0-100
  consensusRequired: number; // 70
  dissentingViews: string[];
  alternativeScenarios: string[];
}

// ============================================================
// KEYWORD EXTRACTION
// ============================================================
function extractKeywords(topic: string): {
  domain: string;
  timeframe: string;
  urgency: string;
  scope: string;
} {
  const lower = topic.toLowerCase();

  let domain = "allgemein";
  if (lower.includes("ki") || lower.includes("ai") || lower.includes("technolog") || lower.includes("digital") || lower.includes("roboter") || lower.includes("software") || lower.includes("app") || lower.includes("comput") || lower.includes("internet") || lower.includes("blockchain") || lower.includes("quanten")) domain = "technologie";
  else if (lower.includes("wirtschaft") || lower.includes("markt") || lower.includes("unternehmen") || lower.includes("finanz") || lower.includes("geld") || lower.includes("börse") || lower.includes("aktie") || lower.includes("invest") || lower.includes("handel") || lower.includes("industrie") || lower.includes("startup")) domain = "wirtschaft";
  else if (lower.includes("gesellschaft") || lower.includes("sozial") || lower.includes("kultur") || lower.includes("mensch") || lower.includes("bevölkerung") || lower.includes("familie") || lower.includes("jugend") || lower.includes("senioren") || lower.includes("arbeitnehmer")) domain = "gesellschaft";
  else if (lower.includes("politik") || lower.includes("regierung") || lower.includes("gesetz") || lower.includes("staat") || lower.includes("wahl") || lower.includes("partei") || lower.includes("demokratie") || lower.includes("diktatur") || lower.includes("eu ") || lower.includes("parlament")) domain = "politik";
  else if (lower.includes("umwelt") || lower.includes("klima") || lower.includes("natur") || lower.includes("energie") || lower.includes("nachhaltig") || lower.includes("co2") || lower.includes("emission") || lower.includes("recycling") || lower.includes("erneuerbar")) domain = "umwelt";
  else if (lower.includes("gesundheit") || lower.includes("medizin") || lower.includes("krank") || lower.includes("arzt") || lower.includes("krankenhaus") || lower.includes("pharma") || lower.includes("therapie") || lower.includes("impf") || lower.includes("virus") || lower.includes("ernährung")) domain = "gesundheit";
  else if (lower.includes("bildung") || lower.includes("schule") || lower.includes("lernen") || lower.includes("studium") || lower.includes("universität") || lower.includes("lehrer") || lower.includes("schüler") || lower.includes("ausbildung") || lower.includes("kompetenz")) domain = "bildung";

  let timeframe = "5-10 Jahre";
  if (lower.includes("2030")) timeframe = "bis 2030";
  else if (lower.includes("2040")) timeframe = "bis 2040";
  else if (lower.includes("2050")) timeframe = "bis 2050";
  else if (lower.includes("2026") || lower.includes("nächstes jahr") || lower.includes("kommendes jahr")) timeframe = "1-2 Jahre";
  else if (lower.includes("2027")) timeframe = "2-3 Jahre";
  else if (lower.includes("monat") || lower.includes("woche") || lower.includes("tag")) timeframe = "wenige Monate";

  let urgency = "normal";
  if (lower.includes("krise") || lower.includes("notfall") || lower.includes("dringend") || lower.includes("katastrophe")) urgency = "kritisch";
  else if (lower.includes("chance") || lower.includes("möglichkeit") || lower.includes("potenzial")) urgency = "opportunität";

  let scope = "national";
  if (lower.includes("welt") || lower.includes("global") || lower.includes("international") || lower.includes("erde")) scope = "global";
  else if (lower.includes("europa") || lower.includes("asien") || lower.includes("afrika") || lower.includes("amerika")) scope = "regional";
  else if (lower.includes("stadt") || lower.includes("lokal") || lower.includes("region")) scope = "lokal";

  return { domain, timeframe, urgency, scope };
}

// ============================================================
// DEEP PROFESSIONAL TEMPLATES
// ============================================================

interface RoundTemplates {
  analysis: string[];
  brainstorming: string[];
  critique: string[];
  debate: string[];
  antithesis: string[];
  synthesis: string[];
  stress_test: string[];
  consensus_building: string[];
  validation: string[];
  prediction: string[];
}

const DOMAIN_TEMPLATES: Record<string, RoundTemplates> = {
  technologie: {
    analysis: [
      "Aus technologischer Perspektive muss ich die Reife des Technologie-Stacks bewerten. '{topic}' basiert auf {foundation}-Grundlagen, wobei die kritische Komponente {critical_factor} einen Technologie-Readiness-Level von geschätzt TRL {trl} aufweist. Die technische Schuldenlast wird bei {debt}% liegen.",
      "Die Patentlandschaft zeigt: In den letzten 24 Monaten wurden {count} relevante Patente angemeldet, wobei der Gini-Koeffizient der Verteilung auf {gini} hindeutet. Das ist ein Indikator für {interpretation}.",
      "Architekturell gesehen stellt '{topic}' eine {arch_type}-Herausforderung dar. Die Hauptengpässe liegen bei {bottleneck}, nicht bei der Kerntechnologie selbst. Das ist eine klassische Infrastruktur-Subventions-Falle.",
      "Die Interoperabilitätsanalyse ergibt: Kompatibilität mit bestehenden Standards beträgt geschätzt {compat}%. Das bedeutet entweder kostspielige Migration oder ein neues Ökosystem – beides hat fundamentale Implikationen für die Adoptionskurve.",
    ],
    brainstorming: [
      "Ein emergentes Szenario: Die Konvergenz von '{topic}' mit {convergence_tech} könnte einen multiplikativen Effekt erzeugen. Mathematisch: Wenn Tech A 10x beschleunigt und Tech B 5x, ist das Ergebnis nicht 15x, sondern potenziell 50x durch nicht-lineare Interaktion.",
      "Was, wenn wir das Problem als inverse Plattform betrachten? Statt '{topic}' als Dienstleistung zu verkaufen, als Infrastruktur-commons zu gestalten. Das würde den TAM (Total Addressable Market) verzehnfachen, aber das Geschäftsmodell komplett umkrempeln.",
      "Der Adjazienz-Sprung: Die eigentliche Durchbruchsanwendung von '{topic}' könnte in {adjacent_sector} liegen, nicht dort wo wir heute suchen. Das ist das Innovator's-Dilemma-Muster in Reinform.",
      "Ein Black-Swan-Szenario: Wenn ein Akteur mit {resource}-Ressourcen und {reach}-Reichweite morgen '{topic}' für strategisch kritisch erklärt, ändert sich das Kapital-Risiko-Kalkül fundamental. Schätzwahrscheinlichkeit: {black_swan_prob}%.",
    ],
    critique: [
      "Ich muss die Grundannahme hinterfragen: Die technische Machbarkeit impliziert nicht wirtschaftliche oder soziale Wünschenswertheit. Die Begründungskette hat bei Schritt 2 einen logischen Sprung, der {gap_size}% der Schlussfolgerungen invalidiert.",
      "Die Evidenzbasis ist schwächer als dargestellt: Von {count} zitierten Studien sind {peer_reviewed}% peer-reviewed, {replicated}% repliziert, und {conflict}% zeigen Interessenkonflikte der Autoren. Das ist kein robustes Fundament.",
      "Der Hype-Zyklus-Check: '{topic}' befindet sich meiner Einschätzung nach an Position {hype_pos} des Gartner-Hype-Zyklus. Das bedeutet, wir sind {hype_years} Jahre vom 'Plateau of Productivity' entfernt – wenn überhaupt.",
      "Eine systematische Blindspot-Analyse ergibt: {blindspot_count} kritische Variablen werden in der aktuellen Diskussion nicht berücksichtigt, darunter {blindspot_list}. Das Vertrauensintervall muss entsprechend nach unten korrigiert werden.",
    ],
    debate: [
      "Ich widerspreche fundamental. Die Annahme exponentiellen Wachstums basiert auf einer Fehlinterpretation historischer Daten. Was als exponentiell aussieht, ist meist eine S-Kurve in der Frühphase. Die Trägheitsphase wird unterschätzt.",
      "Das Gegenargument ist nicht ausreichend geprüft. Wenn wir die gleichen Daten mit einem {model}-Modell statt {alt_model} modellieren, sinkt die prognostizierte Wirkung um {reduction}%.",
      "Aber genau hier liegt der Bestätigungsfehler! Wir selektieren Beispiele, die unserer These entsprechen, und ignorieren die {counter_examples} gescheiterten Parallelpojekte. Das ist Survivorship-Bias in Reinform.",
    ],
    antithesis: [
      "Das stärkste Gegenargument: '{topic}' löst ein Problem, das in {alt_solution_years} Jahren durch {alt_solution} ohnehin obsolet wird. Die Investition wäre in eine Sackgasse.",
      "Die entgegengesetzte Position würde lauten: Nicht '{topic}' verändert den Sektor, sondern der Sektor verändert sich unabhängig, und '{topic}' ist nur ein Symptom, nicht die Ursache. Kausalität ist umgekehrt.",
      "Wenn wir die Inversion-Mentalität anwenden: Was müsste wahr sein, damit '{topic}' garantiert scheitert? Die Antworten sind: {failure_conditions}. Jede einzelne davon hat eine Eintrittswahrscheinlichkeit von >{failure_prob}%.",
    ],
    synthesis: [
      "Nach sorgfältiger Abwägung beider Positionen lässt sich eine Synthese formulieren: '{topic}' hat substanzielles Potenzial, aber nur unter {conditions}. Diese Konditionalität wird in der öffentlichen Debatte systematisch unterschlagen.",
      "Der gemeinsame Nenner ist: Technologische Machbarkeit steht außer Frage. Der Knackpunkt ist die ökonomische Skalierung bei gleichzeitiger gesellschaftlicher Akzeptanz. Das Dreieck aus Technologie-Ökonomie-Gesellschaft muss simultan erfüllt sein.",
      "Ich schlage eine differenzierte Position vor: Statt einer binären Erfolg/Misserfolg-Dichotomie sollten wir von einem Wirkungsspektrum ausgehen. Links: {min_outcome} ({min_prob}%). Rechts: {max_outcome} ({max_prob}%). Die Wahrscheinlichkeitsdichte ist nicht normalverteilt, sondern {distribution}-verteilt.",
    ],
    stress_test: [
      "Stresstest-Szenario 1 – Extrem-Skalierung: Wenn '{topic}' innerhalb von 12 Monaten 100x skalieren müsste, würde bei {scale_metric} ein kritischer Bruchpunkt erreicht. Das System würde bei {break_load}% der Zielkapazität kollabieren.",
      "Stresstest-Szenario 2 – Regulatorischer Schock: Annahme einer vollständigen Verbannung in 3 von 5 Hauptmärkten. Die verbleibenden Märkte könnten die Entwicklung mit {remaining_capacity}% finanzieren. Überlebenswahrscheinlichkeit: {survival_prob}%.",
      "Stresstest-Szenario 3 – Konkurrenzdichte: Wenn {competitors} konkurrierende Lösungen mit ähnlicher Qualität innerhalb von 18 Monaten auf den Markt kommen, fragmentiert sich die Aufmerksamkeit. Der Gewinner-Take-All-Effekt würde nicht eintreten.",
      "Stresstest-Szenario 4 – Technologie-Disruption: Ein unerwarteter Durchbruch in {disrupt_field} macht '{topic}' innerhalb von {disrupt_years} Jahren obsolet. Wahrscheinlichkeit basierend auf historischen Daten: {disrupt_prob}%.",
    ],
    consensus_building: [
      "Nach {rounds} Diskussionsrunden sehe ich folgende Konvergenzpunkte: {convergence_points}. Die verbleibenden Dissense betreffen: {dissent_points}. Ich schlage vor, diese als explizite Unsicherheitsfaktoren in das Modell zu integrieren.",
      "Ich kann meine Position modifizieren unter der Bedingung: Wenn {condition} eintritt, bin ich bereit, meine Wahrscheinlichkeitsschätzung von {old_prob}% auf {new_prob}% anzuheben. Das ist mein Kompromissangebot.",
      "Die qualifizierte Übereinstimmung lautet: '{topic}' wird in {timeframe} mit {agreed_prob}% Wahrscheinlichkeit {agreed_outcome} erreichen, vorausgesetzt {agreed_condition}. Diese Formulierung berücksichtigt alle Bedenken.",
    ],
    validation: [
      "Konsistenzprüfung: Die Vorhersage {prediction} ist konsistent mit den historischen Daten aus {historical_period} (Korrelation: {correlation}). Allerdings gibt es einen Ausreißer bei {outlier_event}, der als Warnsignal dient.",
      "Cross-Validierung: Wenn ich die gleiche Analyse mit {alt_method} durchführe, erhalte ich ein Ergebnis von {alt_result} – eine Abweichung von {deviation}%. Innerhalb akzeptabler Toleranz, aber beachtenswert.",
      "Letzte Plausibilitätsprüfung: Das Ergebnis impliziert {implication}. Ist das plausibel im Lichte von {benchmark}? Mein Urteil: {judgement}, mit Vertrauensniveau {confidence}%.",
    ],
    prediction: [
      "Gewichtete Gesamtprognose unter Berücksichtigung aller Expertise-Level und Bias-Korrektur: '{topic}' wird in {timeframe} mit einer Wahrscheinlichkeit von {probability}% zu {outcome} führen. Konfidenzintervall: [{lower_ci}%, {upper_ci}%].",
      "Der Delphi-ähnliche Konsens der {agent_count} Experten ergibt: Median-Prognose {median_outcome}, mit einem Interquartilsabstand von {iqr}. Die Streuung der Antworten deutet auf {spread_interpretation} hin.",
      "Die ausgewiesene Wahrscheinlichkeit von {probability}% ist das Ergebnis einer gewichteten Aggregation über alle Teilnehmer, wobei methodisch robuste Positionen stärker gewichtet wurden. Hintergrundwissen: {background_knowledge}.",
    ],
  },
  wirtschaft: {
    analysis: [
      "Aus makroökonomischer Perspektive betrachtet: '{topic}' beeinflusst {affected_sectors} Sektoren direkt und weitere {indirect_sectors} indirekt. Die gesamtwirtschaftliche Multiplikatorwirkung wird bei {multiplier} liegen, basierend auf Input-Output-Analysen.",
      "Die Kapitalallokation spricht Bände: In den letzten {period} Monaten flossen {capital} Mrd. EUR in den Sektor, bei einer Standardabweichung von {volatility}%. Das Kapital-Konzept-Verhältnis liegt bei {ratio} – historisch betrachtet {ratio_comparison}.",
      "Mikrostrukturelle Analyse: Die Marktkonzentration (HHI) beträgt aktuell {hhi}. Bei '{topic}' würde sich dies auf prognostizierte {hhi_projected} verschieben. Das ist ein signifikanter Wettbewerbsstrukturveränderung.",
    ],
    brainstorming: [
      "Ein übersehenes ökonomisches Modell: '{topic}' als öffentliches Gut mit club-basiertem Zugang. Das würde die Samuelson-Bedingung modifizieren und potenziell eine Pareto-Verbesserung gegenüber rein marktbasierten Ansätzen erzeugen.",
      "Die Plattformökonomik-Dimension: Wenn '{topic}' Netzwerkeffekte der Ordnung {network_order} aufweist, entsteht ein Winner-Take-Most-Markt. Die Frage ist nicht OB ein Monopol entsteht, sondern WER es besitzt.",
      "Ein arbitrage-basiertes Szenario: Die regulatorische Arbitrage zwischen {jurisdiction_a} und {jurisdiction_b} könnte den effektiven Markteintritt um {arbitrage_years} Jahre beschleunigen oder verzögern, abhängig von der Politik-Reaktionsgeschwindigkeit.",
    ],
    critique: [
      "Die ökonomische Modellierung hat einen systematischen Fehler: Sie ignoriert Externalitäten der Ordnung {ext_order}. Wenn diese internalisiert werden müssten, ändert sich die Kosten-Nutzen-Rechnung um {ext_impact}%.",
      "Die angenommene Elastizität von {elasticity} basiert auf Daten aus {elasticity_period}. Post-2020-Daten zeigen jedoch eine strukturelle Veränderung der Nachfrageelastizitäten um {elasticity_shift}%. Das Modell ist veraltet.",
      "Ein fundamentales Problem: Die Cashflow-Prognosen setzen eine {discount_rate}% Discount-Rate voraus. Bei Anpassung auf risikoadjustierte {risk_adjusted_rate}% kippt die Investitionsentscheidung. Das ist kein Marginalproblem, sondern ein Strukturproblem.",
    ],
    debate: [
      "Ich widerspreche der Annahme homogener Märkte. Die Segmentierung zeigt, dass Early-Adopter (Elasticity: {elasticity_early}) und Late-Majority (Elasticity: {elasticity_late}) diametral entgegengesetzte Preis-Absatz-Funktionen haben. Aggregation führt zu Fehlprognosen.",
      "Das Argument der Skaleneffekte ist historisch nicht belastbar. In {counter_pct}% der Fälle mit ähnlicher Skalenerwartung traten Diseconomies of Scale bei {diseconomies_threshold} Einheiten auf. Die U-förmige Kostenkurve wird ignoriert.",
    ],
    antithesis: [
      "Die stärkste Gegenposition: '{topic}' ist ökonomisch nicht nachhaltig, weil die willingness-to-pay (WTP) bei {wtp} liegt, die Kosten aber bei {cost}. Die Lücke von {gap}% kann nicht durch Skaleneffekte geschlossen werden – die mathematische Grenze liegt bei {math_limit}%.",
      "Die Inversion: Angenommen, '{topic}' würde scheitern. Was wären die ökonomischen Folgen? Die Analyse zeigt: Der Opportunity-Cost des Scheiterns beträgt {opportunity_cost} Mrd. EUR, verteilt auf {stakeholders} Stakeholder-Gruppen.",
    ],
    synthesis: [
      "Die ökonomische Synthese ergibt: '{topic}' ist unter den Bedingungen {conditions} ökonomisch tragfähig. Der Break-Even-Punkt liegt bei {breakeven} Einheiten/Markt. Das ist {breakeven_assessment} für die geplante Zeitschiene.",
      "Ein differenzierter Marktansatz: Nicht alle Segmente werden gleich profitieren. Die Cross-Segment-Analyse zeigt, dass {profitable_segments} profitable Segmente sind, während {subsidized_segments} subventioniert werden müssen. Gesamtwirtschaftlich positiv, aber Verteilungsfragen verbleiben.",
    ],
    stress_test: [
      "Stresstest – Rezessionsszenario: Bei BIP-Rückgang von {gdp_shock}% sinkt die Nachfrage nach '{topic}' um {demand_drop}%. Die Fixed-Cost-Struktur der Anbieter führt zu einer Konsolidierungswelle: {consolidation_pct}% der Anbieter scheitern.",
      "Stresstest – Währungsschock: Bei {currency_vol}% Wechselkursvolatilität zwischen {currency_a} und {currency_b} wird die internationale Wertschöpfungskette fragmentiert. Kostensteigerung: {cost_increase}%.",
    ],
    consensus_building: [
      "Ökonomischer Konsens nach Iteration: Der NPV von '{topic}' unter Basisannahmen ist {npv} Mrd. EUR. Unter Sensitivitätsanalyse (±{sensitivity_range}%) schwankt der NPV zwischen {npv_low} und {npv_high}. Diese Bandbreite akzeptieren alle Teilnehmer.",
      "Meine Kompromissposition: Ich akzeptiere eine optimistischere Schätzung, wenn {condition} innerhalb von {condition_timeframe} nachweisbar ist. Andernfalls bleibe ich bei meiner konservativen Einschätzung.",
    ],
    validation: [
      "Ökonomische Plausibilitätsprüfung: Das prognostizierte Wachstum von {growth_rate}% p.a. entspricht dem {percentile}. Perzentil historischer Vergleichsfälle. Das ist {percentile_assessment}.",
      "Cross-Check mit alternativer Bewertungsmethode: {alt_method} ergibt einen Unternehmenswert von {alt_value} statt {base_value}. Die Divergenz von {divergence}% erfordert eine explizite Begründung.",
    ],
    prediction: [
      "Die aggregierte ökonomische Prognose lautet: '{topic}' wird in {timeframe} einen Markt von {market_size} Mrd. EUR generieren bei einer Marktdurchdringung von {penetration}%. Der ROI für First-Mover wird bei {roi_first_mover}% liegen.",
    ],
  },
  gesellschaft: {
    analysis: [
      "Soziodemografisch betrachtet: '{topic}' trifft auf eine Bevölkerung mit medianem Alter von {median_age}, einem Bildungsindex von {education_index} und einem Technologieakzeptanz-Score von {tech_acceptance}. Die Target-Demografie deckt sich nur zu {demographic_overlap}% mit der Early-Adopter-Gruppe.",
      "Die soziale Akzeptanzfunktion ist nicht linear. Meine Analyse der Diffusionsliteratur zeigt: Kritische Masse wird bei {critical_mass}% Penetration erreicht. Vorher besteht die Gefahr des negativen Netzwerkeffekts – wenn zu wenige teilnehmen, wird das Stigma größer als der Nutzen.",
      "Kulturelle Dimensionsanalyse (nach Hofstede erweitert): In Kulturen mit hoher Uncertainty-Avoidance ({uai_high}) wird '{topic}' um {uai_years} Jahre langsamer adaptiert als in niedrig-UAI-Kulturen. Deutschland liegt bei UAI {germany_uai}, was eine spezifische Hürde darstellt.",
    ],
    brainstorming: [
      "Das Grassroots-Szenario: '{topic}' wird nicht von Institutionen getrieben, sondern von informellen Netzwerken. Die Metcalfe's-Law-Analogie für soziale Netzwerke gilt hier in doppelter Weise – technisch UND sozial. Der Tipping-Point könnte plötzlich und unvorhersehbar eintreten.",
      "Das generationsübergreifende Bridge-Modell: Wenn '{topic}' als 'Enkel-eltern-freundlich' positioniert wird, überbrückt es die Adoption-Kluft zwischen Digital-Natives und Silver-Surfern. Das ist ein riesiger, übersehener Markt.",
    ],
    critique: [
      "Die soziale Ingenieurs-Annahme ist gefährlich: Menschen sind keine rationalen Nutzenmaximierer. Die Theory of Planned Behavior zeigt, dass subjective norms (SN) bei '{topic}' einen Einflussfaktor von {sn_weight} haben. Wer die Normen nicht versteht, versteht die Adoption nicht.",
      "Historische Daten zeigen: Von {total_cases} ähnlichen gesellschaftlichen Innovationen scheiterten {failure_cases}% am sozialen Faktor, nicht am technischen. Die Base-Rate für gesellschaftliche Transformation ist niedriger als für technologische.",
    ],
    debate: [
      "Ich widerspreche der Elitenperspektive. '{topic}' wird nicht von Early-Adoptern skaliert, sondern – wenn überhaupt – von der 'late majority'. Die Diffusion of Innovations zeigt klar: Ohne pragmatische Mehrheit bleibt es eine Nische.",
      "Aber Sie ignorieren den 'Law of the Few': Connectors, Mavens und Salesmen bestimmen die Adoption. Wenn {influencer_type} in der Community für '{topic}' eintreten, ändert sich die Diffusionskurve exponentiell.",
    ],
    antithesis: [
      "Das stärkste Gegenargument aus gesellschaftlicher Sicht: '{topic}' könnte eine Polarisierung verstärken, die bereits zu {polarization_level}% existiert. Die Kosten der sozialen Spaltung übersteigen den Nutzen bei Weitem. Die Rawls'sche Differenzprinzip-Prüfung fällt negativ aus.",
    ],
    synthesis: [
      "Die soziale Synthese: '{topic}' wird akzeptiert, wenn drei Bedingungen gleichzeitig erfüllt sind: (1) wahrgenommener Nutzen > wahrgenommene Komplexität, (2) soziale Norm unterstützend oder neutral, (3) keine existenzielle Bedrohung für etablierte Identitätsmarker. Die Wahrscheinlichkeit aller drei: {triple_prob}%.",
    ],
    stress_test: [
      "Sozialer Stresstest: Wenn eine einflussreiche NGO/Religionsgemeinschaft/Medienfigur '{topic}' öffentlich ablehnt, sinkt die Akzeptanz in der Zielgruppe um {rejection_impact}%. Die Erholung davon dauert historisch {recovery_years} Jahre.",
    ],
    consensus_building: [
      "Sozialer Konsens: Wir stimmen überein, dass die Adoption von '{topic}' ein Spektrum ist, kein Binärwert. Mindestakzeptanz: {min_acceptance}% (pragmatische Nutzung). Maximale Reichweite: {max_reach}% (enthusiastische Nutzung). Realistisches Szenario: {realistic}%.",
    ],
    validation: [
      "Plausibilitätscheck: Die prognostizierte Akzeptanz von {acceptance}% entspricht historisch dem Akzeptanzverlauf von {historical_analogon}. Die Analogie ist {analogy_strength}, da die Kontextfaktoren zu {context_match}% übereinstimmen.",
    ],
    prediction: [
      "Soziale Vorhersage: In {timeframe} wird '{topic}' in urbanen, hochgebildeten Milieus ({urban_educated}%) etabliert sein, in ländlichen Milieus bei {rural}%. Die digitale Kluft (bestehend bei {digital_gap}%) wird sich dadurch {gap_change} verändern.",
    ],
  },
  politik: {
    analysis: [
      "Regulatorische Impact-Bewertung: '{topic}' überschneidet sich mit {policy_areas} Politikfeldern. Die föderale Kompetenzverteilung in Deutschland (bzw. äquivalente Strukturen anderswo) erzeugt einen Policy-Fragmentierungs-Effekt, der die Umsetzung um {fragmentation_delay} Monate verzögert.",
      "Die Parteiendifferenzanalyse zeigt: {partisan_gap}% Abstand zwischen Befürwortern und Gegnern über Parteigrenzen hinweg. Bei einem Partisan-Gap >{threshold}% ist eine konsensuale Politik unwahrscheinlich. Aktuell: {current_gap}%.",
      "Lobby-Kraftfeld-Analyse: {pro_lobby} Akteure fördern '{topic}', {con_lobby} Akteure opponieren. Die asymmetrische Ressourcenverteilung (Verhältnis {resource_ratio}) begünstigt das Ergebnis zugunsten von {advantage_side}.",
    ],
    brainstorming: [
      "Das Policy-Window-Szenario: Nach dem Multiple-Streams-Framework von Kingdon müssen Problemstrom, Politikstrom und Politikstrom konvergieren. Die nächste Konvergenz wird erwartet bei {policy_window_event}. '{topic}' muss dann 'policy-ready' sein.",
      "Regulatorische Sandbox-Strategie: Wenn 3-5 Länder koordiniert Pilotprojekte starten, entsteht ein 'regulatory race to the top'. Das {sandbox_org} könnte den koordinierenden Rahmen setzen.",
    ],
    critique: [
      "Die Annahme rationaler politischer Entscheidungsfindung ist eine Noble-Lie. Die Public-Choice-Theorie zeigt: Politiker maximieren Wiederwahlwahrscheinlichkeit, nicht Gesamtwohlfahrt. Der Zeithorizont von '{topic}' ({topic_horizon}) übersteigt typische Legislaturperioden ({legislature_period}).",
      "Internationale Koordination scheitert an {coordination_barriers} Barrieren. Das Prisoner's-Dilemma der internationalen Klimapolitik ist das beste Analogon – und es zeigt: Freiwillige Kooperation funktioniert nicht. Verbindliche Mechanismen brauchen 5-10 Jahre.",
    ],
    debate: [
      "Ich widerspreche der Policy-Pessimismus-Position. Die europäische regulatorische Prägung ('Brussels Effect') zeigt, dass EU-Regulierung globale Standards setzt. '{topic}' könnte ein Brussels-Effect-Kandidat sein, wenn {brussels_condition}.",
    ],
    antithesis: [
      "Die regulatorische Antithese: '{topic}' wird durch Politik-Blocking nicht weiterentwickelt. Das Veto-Player-Modell von Tsebelis sagt: Bei {veto_players} Veto-Spielern und einer Divergenz von {divergence} ist Policy-Change unmöglich. Aktuelle Analyse: {veto_analysis}.",
    ],
    synthesis: [
      "Regulatorische Synthese: Ein progressiver, aber fragmentierter Regulierungsrahmen ist das wahrscheinlichste Szenario. Führende Jurisdiktionen: {leading_jurisdictions}. Nachziehende Jurisdiktionen: {lagging_jurisdictions}. Die Divergenz wird {divergence_years} Jahre bestehen.",
    ],
    stress_test: [
      "Politischer Stresstest: Regierungswechsel in {critical_elections} kritischen Wahlen innerhalb von {election_window} Jahren. Jeder Wechsel kann die '{topic}'-Politik um bis zu {policy_reversal} Jahre zurückwerfen.",
    ],
    consensus_building: [
      "Regulatorischer Konsens: Minimale Einigung – Sandbox-Experimente in {sandbox_count} Ländern. Maximale Einigung – Harmonisierter globaler Rahmen. Realistische Einigung – Patchwork mit Kernstandards. Wir positionieren uns auf: {consensus_position}.",
    ],
    validation: [
      "Validierung gegen historische Policy-Zyklen: Die prognostizierte Timeline von {timeline} Jahren entspricht dem historischen Durchschnitt für ähnliche regulatorische Prozesse ({historical_avg} Jahre) mit einer Abweichung von {deviation}%.",
    ],
    prediction: [
      "Politische Prognose: In {timeframe} werden {leading_count} Jurisdikktionen klare regulatorische Rahmen haben, {lagging_count} werden fragmentiert regulieren, und {blocking_count} werden aktiv blockieren. Der globale Standard wird ein de-facto-Standard durch Marktmacht, nicht durch Verhandlung.",
    ],
  },
  umwelt: {
    analysis: [
      "Ökologische Footprint-Analyse: '{topic}' hat einen direkten Carbon-Footprint von {carbon_direct} tCO2e/Einheit und einen indirekten (Scope 3) von {carbon_indirect} tCO2e. Die Netto-Ökobilanz ist {net_balance}, basierend auf LCA-Methodik (ISO 14040/14044).",
      "Die Planetary-Boundaries-Analyse zeigt: '{topic}' beeinflusst direkt die Grenzen {pb_affected}. Das Resilienz-Fenster (Zeit bis zur irreversiblen Schädigung) beträgt {resilience_window} Jahre bei Business-as-Usual.",
      "Ökosystem-Service-Bewertung: Der monetäre Wert der betroffenen Ökosystemleistungen beträgt {es_value} Mrd. EUR/Jahr. '{topic}' beeinflusst {es_affected}% davon. Das ist der eigentliche volkswirtschaftliche Maßstab.",
    ],
    brainstorming: [
      "Das Circular-Economy-Szenario: '{topic}' wird nicht linear, sondern kreislauforientiert implementiert. Das Ellen-MacArthur-Framework zeigt: Kreislaufwirtschaft reduziert Ressourceninput um {circularity_savings}% bei gleichzeitiger Wertschöpfungserhöhung um {value_increase}%.",
      "Die Biomimikry-Dimension: Natur hat dieses Problem vor {evolution_years} Millionen Jahren gelöst. Das {biological_analogon} zeigt einen Ansatz, der {bio_efficiency}% effizienter ist als jede menschliche Lösung bisher.",
    ],
    critique: [
      "Die Jevons-Paradoxie ist real: In {jevons_cases}% der Fälle mit ähnlicher Effizienzsteigerung wurde der Ressourceneinsparungseffekt durch Rebound-Effekte überkompensiert. Die absolute Ressourcennutzung stieg um {rebound_pct}%.",
      "Die Skalierungsfalle: Labordaten zeigen {lab_efficiency}% Effizienz. Bei Pilotskala sinkt dies auf {pilot_efficiency}%, bei industrieller Skala auf {industrial_efficiency}%. Der 'Valley of Death' zwischen Pilot und Skala ist {valley_width} Jahre breit.",
    ],
    debate: [
      "Ich widerspreche der Technologie-Optimismus-Position. Die IEA-Daten zeigen: Wir haben historisch die Adoption sauberer Technologien um {historical_gap} Jahre ÜBER das notwendige Tempo unterschätzt. Das ist kein Zufall, sondern systematisch.",
    ],
    antithesis: [
      "Die ökologische Antithese: '{topic}' könnte ein Greenwashing-Phantom sein. Die wahre ökologische Wirkung wird durch {greenwash_factor} maskiert. Nach Entfernung der Maskierung: Netto-negativer Effekt von {true_impact}%.",
    ],
    synthesis: [
      "Ökologische Synthese: '{topic}' ist unter den Bedingungen {green_conditions} ökologisch vorteilhaft. Der Break-even-Punkt (kumulativ) liegt bei {green_breakeven} Jahren. Vorher ist es ökologisch schädlich, danach vorteilhaft. Dieses 'ökologische Investitionsproblem' muss kommuniziert werden.",
    ],
    stress_test: [
      "Klima-Stresstest: Bei {warming_scenario} Erwärmungsszenario (RCP {rcp}) verändert sich das ökonomische Umfeld für '{topic}' um {climate_impact}%. Positive Feedback-Loops: {positive_feedbacks}. Negative Feedback-Loops: {negative_feedbacks}.",
    ],
    consensus_building: [
      "Ökologischer Konsens: Alle stimmen zu, dass '{topic}' ökologisch nur unter {green_condition} sinnvoll ist. Der Streitpunkt ist: Tritt {green_condition} mit ausreichender Wahrscheinlichkeit ({condition_probability}%) ein? Meine Position: {position}.",
    ],
    validation: [
      "Validierung: Die ökologischen Projektionen wurden mit {validation_method} gegengeprüft. Übereinstimmung: {validation_agreement}%. Die verbleibende Unsicherheit konzentriert sich auf: {uncertainty_focus}.",
    ],
    prediction: [
      "Ökologische Vorhersage: In {timeframe} wird '{topic}' einen Netto-Ökoeffekt von {net_eco_effect} tCO2e/Jahr haben. Das entspricht {pct_of_target}% des notwendigen Beitrags für {climate_target}. Der Beitrag ist {contribution_assessment}.",
    ],
  },
  gesundheit: {
    analysis: [
      "Evidenzbasierte Analyse: Für '{topic}' liegen {study_count} Studien vor (RCTs: {rct_count}, Meta-Analysen: {meta_count}). Die durchschnittliche Effektstärke (Cohen's d) beträgt {effect_size}. Das GRADE-Rating der Evidenzqualität: {grade_rating}.",
      "Die regulatorische Landscape: FDA/EMA-Pfad für '{topic}' schätzt sich auf {approval_timeline} Monate. Der kritische Pfad ist {critical_path}. Parallel-Track-Approval (wie bei COVID-19) ist mit Wahrscheinlichkeit {parallel_prob}% möglich.",
      "Health-Economics-Assessment: Der ICER (Incremental Cost-Effectiveness Ratio) liegt bei {icer} EUR/QALY. Der willingness-to-pay threshold in Deutschland beträgt ~{wtp_threshold} EUR/QALY. Positionierung: {icer_position}.",
    ],
    brainstorming: [
      "Precision-Medicine-Szenario: '{topic}' wird nicht als One-Size-Fits-All, sondern als stratifizierte Lösung implementiert. Die pharmakogenomische Stratifizierung könnte die Wirksamkeit von {base_efficacy}% auf {stratified_efficacy}% steigern.",
      "Das Präventions-Paradigma: Wenn '{topic}' im präventiven statt kurativen Kontext eingesetzt wird, verändert sich die ökonomische Rechnung fundamental. ROI im Präventionsmodus: {prevention_roi}x höher als im Kurativmodus.",
    ],
    critique: [
      "Die klinische Evidenz hat Lücken: {evidence_gaps} wesentliche Evidenzlücken wurden identifiziert. Die Follow-up-Dauer in den Studien beträgt median {followup_months} Monate – für Langzeitwirkungen unzureichend. Publication Bias: funnel plot asymmetrisch (Egger's p = {egger_p}).",
      "Safety-Signal-Analyse: In den verfügbaren Daten traten {adverse_events} unerwünschte Ereignisse auf (Rate: {ae_rate}%). Davon {serious_ae}% schwerwiegend. Das Safety-Profil ist {safety_assessment} im Vergleich zum Standard-of-Care.",
    ],
    debate: [
      "Ich widerspreche der COVID-19-Analogie. Die Pandemie-Beschleunigung war ein singuläres Ereignis unter Existenzbedrohung. '{topic}' hat keine vergleichbare Dringlichkeit. Die regulatorische Normalisierung wird den historischen Durchschnitt von {historical_approval} Monaten wiederherstellen.",
    ],
    antithesis: [
      "Die medizinische Antithese: Der Placebo-Effekt könnte die beobachteten Effekte von '{topic}' vollständig erklären. Bei Kontrolle für Placebo (aktive Placebo-Designs) sinkt die Effektstärke auf {placebo_corrected_effect}. Das ist klinisch nicht relevant.",
    ],
    synthesis: [
      "Medizinische Synthese: '{topic}' hat bei {target_population} eine nachweisbare Wirkung von {synthesis_effect}%. Die Evidenzqualität ist {evidence_quality}. Empfohlen wird eine bedingte Zulassung mit Post-Market-Surveillance.",
    ],
    stress_test: [
      "Stresstest – Resistenzentwicklung: Bei {resistance_scenario} entwickelt sich Resistenz/Adaptation innerhalb von {resistance_years} Jahren. Die Nutzungsdauer des ersten-Generation-Ansatzes ist begrenzt. Zweite Generation benötigt {gen2_timeline} Jahre Entwicklung.",
    ],
    consensus_building: [
      "Medizinischer Konsens: Wir stimmen überein, dass '{topic}' eine Option für {consensus_population} ist. Offener Punkt: Die Langzeitdaten müssen nachgereicht werden innerhalb von {data_deadline} Monaten. Monitoring-Protokoll: {monitoring_protocol}.",
    ],
    validation: [
      "Validierung: Die medizinischen Schlussfolgerungen wurden gegen {guideline_name}-Guidelines geprüft. Konformität: {guideline_conformity}%. Abweichungen: {deviations} – begründet und dokumentiert.",
    ],
    prediction: [
      "Medizinische Vorhersage: In {timeframe} wird '{topic}' in {specialist_availability}% der Spezialzentren und {general_availability}% der allgemeinen Versorgung verfügbar sein. Die Kostendeckung durch Gesetzliche Krankenversicherung: {insurance_coverage}%.",
    ],
  },
  bildung: {
    analysis: [
      "Bildungswissenschaftliche Analyse: '{topic}' adressiert {learning_theory} Lernparadigmen. Die Evidenzbasis umfasst {education_studies} Studien mit einer durchschnittlichen Effektstärke (Hattie-Style) von {hattie_effect}. Visible-Learning-Schwelle (d > 0.4): {above_threshold}.",
      "Die Implementierungsökologie: Lehrer-Akzeptanz liegt bei {teacher_acceptance}%, Schulleiter-Akzeptanz bei {principal_acceptance}%. Die größte Hürde ist nicht die Technologie, sondern die Professional Development Lücke von {pd_gap} Stunden Training.",
      "Bildungssystem-Analyse: '{topic}' beeinflusst {system_layers} Ebenen des Bildungssystems (Lehrplan, Didaktik, Assessment, Governance). Multilevel-Veränderungen haben historisch eine Latenz von {multilevel_latency} Jahren.",
    ],
    brainstorming: [
      "Das Adaptive-Learning-Szenario: '{topic}' als Kern eines Personalisierte-Bildungs-Ökosystems. Die Bloom's-2-Sigma-Problem-Lösung: Individuelles Lernen bei {effectiveness}% der Effektivität von Einzelunterricht, aber bei {cost_fraction}% der Kosten.",
      "Das Lebenslanges-Lernen-Szenario: '{topic}' nicht nur für formelle Bildung, sondern als Infrastruktur für Continuous Reskilling. Die Halbwertszeit von Kompetenzen beträgt aktuell {skill_half_life} Jahre – '{topic}' als Antwort.",
    ],
    critique: [
      "Die Transfer-Problematik: Lernen in '{topic}'-Kontexten transferiert mit {transfer_rate}% in reale Anwendungskontexte. Das ist der bekannte Inert-Wissen-Transfer-Problem. Ohne situated learning-Komponente bleibt die Wirkung oberflächlich.",
      "Der Matthew-Effekt in Bildung: '{topic}' könnte bestehende Bildungsungleichheiten verstärken. Digitale Kluft: {digital_divide}%. Sozioökonomischer Status korreliert mit Nutzungshäufigkeit um r = {ses_correlation}. Das ist keine Nebenwirkung, sondern ein Haupteffekt.",
    ],
    debate: [
      "Ich widerspreche der Techno-Optimismus-Position. Die Hattie-Daten zeigen: Teacher-Estimates (d = 1.57) übertrifft JEDE Technologieintervention. '{topic}' sollte Lehrer verstärken, nicht ersetzen. Der Ersatz-Ansatz ist kontraproduktiv.",
    ],
    antithesis: [
      "Die bildungspolitische Antithese: '{topic}' ist ein Ablenkungsmanöver von den eigentlichen Problemen (Lehrermangel: {teacher_shortage}%, Infrastrukturdefizite: {infrastructure_deficit}%, Curriculum-Veraltung: {curriculum_age} Jahre). Es behandelt Symptome, nicht Ursachen.",
    ],
    synthesis: [
      "Bildungssynthese: '{topic}' als Lehrer-Verstärkung (nicht Ersatz) in {synthesis_contexts} Kontexten, mit obligatorischem Professional Development von {pd_hours} Stunden, und expliziter Equity-Komponente. Nur dann ist die Wirkung nachhaltig positiv.",
    ],
    stress_test: [
      "Stresstest – Budgetkürzung: Bei {budget_cut}% Kürzung des Bildungsetats ist '{topic}' das erste, das gestrichen wird (periphere Innovation). Die institutionelle Trägheit priorisiert Kerngeschäft vor Innovation.",
    ],
    consensus_building: [
      "Bildungs-Konsens: Einigung auf einen Pilot-Ansatz in {pilot_regions} Regionen, mit {pilot_duration} Jahren Laufzeit, kontrolliertem Design, und expliziter Equity-Monitoring. Skalierung erst nach positivem Ergebnis.",
    ],
    validation: [
      "Validierung: Die Bildungsempfehlungen wurden gegen {framework_name} Standards geprüft. Alignment: {alignment}%. Missing Components: {missing_components}.",
    ],
    prediction: [
      "Bildungsvorhersage: In {timeframe} wird '{topic}' in {formal_adoption}% der formalen Bildungseinrichtungen als {adoption_depth} integriert sein. Die Lernergebnisverbesserung wird bei {learning_gain} Standardabweichungen liegen (Hattie-metric).",
    ],
  },
  allgemein: {
    analysis: [
      "Systemanalytische Betrachtung: '{topic}' ist ein mehrdimensionales Phänomen, das {dimensions} Hauptdimensionen und {subdimensions} Subdimensionen umfasst. Die Interdependenzmatrix zeigt {interdependencies} nicht-triviale Wechselwirkungen. Isolierte Betrachtung ist methodisch unzulässig.",
      "Die Komplexitätsanalyse ergibt: '{topic}' hat eine Cynefin-Klassifikation von {cynefin_class}. Das bedeutet: {cynefin_implication}. Der naheliegende Fehler ist, ein komplexes Problem wie ein kompliziertes zu behandeln.",
      "Historische Analogie-Suche: Von {analog_cases} identifizierten Präzedenzfällen hatten {success_cases} einen positiven, {failure_cases} einen negativen, und {mixed_cases} einen gemischten Ausgang. Die Base-Rate für Erfolg liegt bei {base_rate}%.",
    ],
    brainstorming: [
      "Das emergente Szenario: Die Sekundär- und Tertiäreffekte von '{topic}' könnten die Primäreffekte bei Weitem übersteigen. Wie der Eisenbahn nicht nur Transport, sondern Urbanisierung, Industrialisierung und Zeitstandardisierung brachte – welche emergenten Effekte hat '{topic}'?",
      "Das Inversion-Szenario: Was müsste alles WAHRE SEIN, damit '{topic}' garantiert scheitert? Die Antwort-Liste enthält {failure_conditions} Bedingungen. Die Wahrscheinlichkeit, dass ALLE eintreten: {all_fail_prob}%. Die Wahrscheinlichkeit, dass MINDESTENS EINE eintritt: {any_fail_prob}%.",
    ],
    critique: [
      "Die epistemologische Grenze: Wir versuchen, ein komplexes adaptives System mit linearen Modellen vorherzusagen. Das ist strukturell unmöglich über einen Horizont von {prediction_horizon} Jahren. Alle Prognosen sind Szenarien, keine Vorhersagen.",
      "Der Narrative-Fall: Unsere Analyse ist nicht neutral. Sie folgt implizit dem Narrativ {implicit_narrative}. Alternative Narrative: {alternative_narratives}. Jedes Narrativ führt zu anderen Schwerpunkten und damit zu anderen Ergebnissen.",
    ],
    debate: [
      "Ich widerspreche der Annahme berechenbarer Zukunft. In komplexen Systemen sind Black Swan Events nicht Ausnahmen, sondern Regel. Die Frage ist nicht OB ein unvorhergesehenes Ereignis eintritt, sondern WELCHE Richtung es hat.",
    ],
    antithesis: [
      "Die fundamentale Antithese: '{topic}' ist ein Symptom, nicht eine Ursache. Die wirkliche Treiber sind: {real_drivers}. '{topic}' selbst hat kaum kausale Kraft – es wird von tieferliegenden Kräften getrieben, nicht umgekehrt.",
    ],
    synthesis: [
      "Die methodische Synthese: Statt einer Punktprognose liefern wir ein Wahrscheinlichkeits-Feld. Die Dichte ist über {outcome_range} verteilt, mit Modalwert bei {mode}, Median bei {median}, und schweren Rändern bei {heavy_tails}. Das ist die ehrlichste Darstellung der Unsicherheit.",
    ],
    stress_test: [
      "Globaler Stresstest: Bei gleichzeitigem Auftreten von {black_swan_combo} verschiebt sich die Wahrscheinlichkeitsverteilung um {distribution_shift}. Das zuvor wahrscheinlichste Szenario wird zum unwahrscheinlichsten.",
    ],
    consensus_building: [
      "Konsens nach intensiver Debatte: Alle {agent_count} Experten stimmen in {agreement_points} Punkten überein, haben in {dissent_points} Punkten qualifizierte Dissense, und vereinbaren in {open_points} Punkten explizite Unsicherheit. Das ist kein Scheitern, sondern wissenschaftliche Redlichkeit.",
    ],
    validation: [
      "Finale Validierung: Die Konsistenz aller Aussagen wurde logisch geprüft. {consistency_check} Widersprüche wurden identifiziert und aufgelöst. Die verbleibende Kohärenz des Modells beträgt {coherence}%.",
    ],
    prediction: [
      "Die gewichtete Konsensprognose (nur bei ausreichendem Übereinkommen ausgegeben): '{topic}' wird in {timeframe} mit {consensus_level}% Konsensniveau wahrscheinlich zu {main_outcome} führen, mit {alternative_count} alternativen Szenarien als explizite Unsicherheiten. Konfidenz: {confidence}%.",
    ],
  },
};

// ============================================================
// AGENT-SPECIFIC DEEP TEMPLATES
// ============================================================

const AGENT_TEMPLATES: Record<string, Partial<RoundTemplates>> = {
  data_analyst: {
    analysis: [
      "Datengetriebene Erstanalyse: Ich habe {count} relevante Datensätze aus {sources} Quellen analysiert. Die deskriptive Statistik zeigt: Mittelwert = {mean}, Median = {median}, Standardabweichung = {std}, Schiefe = {skewness}. Die Verteilung ist {distribution_type}, was {distribution_implication} bedeutet.",
      "Regressionsanalyse mit {predictors} Prädiktoren ergibt ein adjustiertes R² von {r_squared}. Die signifikanten Prädiktoren (p < 0.01) sind: {significant_predictors}. Multikollinearität (VIF) liegt bei max {max_vif} – akzeptabel.",
    ],
    critique: [
      "Methodenkritisch muss ich anmerken: Die verwendete Stichprobe hat eine Selection Bias von geschätzt {selection_bias}%. Die Non-Response-Rate beträgt {nonresponse}%. Das Konfidenzintervall muss um den Faktor {ci_factor} erweitert werden.",
      "Der p-Wert von {p_value} allein ist nicht ausreichend. Unter Berücksichtigung des Base Rates ({base_rate}%) und der Test-Sensitivität ergibt sich ein positiver prädiktiver Wert von nur {ppv}%. Bayesianisch betrachtet ist das Ergebnis {bayesian_assessment}.",
    ],
    stress_test: [
      "Monte-Carlo-Simulation mit {simulations} Läufen und {variables} stochastischen Variablen: Der 5. Perzentil-Wert liegt bei {p5}, der 95. Perzentil-Wert bei {p95}. Der Value at Risk (95%) beträgt {var_95}. Das ist der robuste Planungswert.",
    ],
    prediction: [
      "Mein quantitatives Vorhersagemodell (Ensemble aus {model_types}) prognostiziert: {probability}% Wahrscheinlichkeit für das Basisszenario, Konfidenzintervall [{ci_lower}%, {ci_upper}%] bei 95%-Niveau. Die Modellgüte (AUROC) beträgt {auroc}.",
    ],
  },
  tech_visionary: {
    analysis: [
      "Technologie-Radar-Analyse: '{topic}' befindet sich an der Konvergenz von {convergence_techs}. Das ist kein isolierter Trend, sondern ein Konvergenz-Moment – ähnlich wie Smartphone = Telefon + Computer + Internet. Die Multiplikatoreffekte sind nicht-linear.",
      "Die Wright's-Law-Projektion für '{topic}' zeigt: Bei jedem Verdopplung der kumulativen Produktion sinken die Kosten um {learning_rate}%. Das bedeutet einen Kostenvorteil gegenüber etablierten Lösungen in {cost_parity_years} Jahren.",
    ],
    critique: [
      "Ich verstehe die Skepsis, aber wir unterschätzen systematisch exponentielle Kurven. Menschen denken linear, Technologie wächst exponentiell. Die Diskrepanz zwischen Erwartung und Realität erklärt 90% der Prognosefehler.",
    ],
    prediction: [
      "Meine exponentielle Projektion: '{topic}' wird in {timeframe} die Performance um den Faktor {performance_factor} steigern, die Kosten um den Faktor {cost_factor} senken, und damit {adoption_rate}% Marktdurchdringung erreichen. Die breite Masse wird überrascht sein.",
    ],
  },
  skeptic: {
    analysis: [
      "Ich muss eine dissonante Stimme einbringen. Die Evidenzlage für '{topic}' ist: {evidence_assessment}. Von {total_claims} Behauptungen sind {verified} empirisch verifiziert, {plausible} theoretisch plausibel, und {speculative} reine Spekulation.",
      "Survivorship-Bias-Check: Wir betrachten '{topic}' als Erfolgsgeschichte, ignorieren aber {failed_analogues} gescheiterte Analogfälle. Die Base-Rate des Erfolgs in dieser Kategorie liegt bei {success_rate}% – das ist der richtige Ausgangspunkt.",
    ],
    critique: [
      "Das ist wunschdenken. Die Trägheit realer Systeme – regulatorisch, sozial, ökonomisch – wird diese Vision zerschellen lassen. Technologie ist nie der limitierende Faktor; Adoption ist. Und Adoption folgt nicht technologischer Logik.",
      "Hype-Zyklus-Analyse: '{topic}' zeigt die klassischen Symptome von Phase {hype_phase} – mediale Überberichterstattung, überzogene Erwartungen, fehlende Skalierbarkeit. Der 'Trough of Disillusionment' wird in {trough_time} Monaten erreicht.",
    ],
    antithesis: [
      "Die stärkste Gegenposition, die ich konstruieren kann: Alle positiven Szenarien setzen voraus, dass {critical_assumption} wahr ist. Die Wahrscheinlichkeit dieser Annahme ist höchstens {assumption_prob}%. Daraus folgt: Die Erfolgswahrscheinlichkeit ist nicht {claimed_prob}%, sondern höchstens {corrected_prob}%.",
    ],
    prediction: [
      "Meine realistische Einschätzung (nicht pessimistisch, nur realistisch): '{topic}' wird in {timeframe} {skeptic_outcome}. Die Versprechen werden zu {promise_fulfillment}% eingelöst. Der Rest ist Hype-Rückstand.",
    ],
  },
  strategist: {
    analysis: [
      "Strategische Marktpositionierung: '{topic}' muss drei Hürden nehmen – Product-Market-Fit, Go-to-Market-Skalierung, und Sustained Competitive Advantage. Die jeweiligen Erfolgswahrscheinlichkeiten: {pmf_prob}%, {gtm_prob}%, {sca_prob}%. Kombiniert: {combined_prob}%.",
      "Porter's-Five-Forces-Analyse: Die Branchenattraktivität für '{topic}' wird bestimmt durch: Threat of New Entrants ({threat_new}), Bargaining Power of Suppliers ({supplier_power}), Threat of Substitutes ({threat_substitute}), Competitive Rivalry ({rivalry}). Gesamtbewertung: {porter_score}/10.",
    ],
    stress_test: [
      "Business-Stresstest: Wenn '{topic}' innerhalb von {stress_months} Monaten nicht {traction_metric} erreicht, wird das Runway auf {runway_months} Monate schrumpfen. Die nächste Finanzierungsrunde wird bei {downround_prob}% ein Downround.",
    ],
    prediction: [
      "Strategische Prognose: '{topic}' wird in {timeframe} in {niche_or_mass} positioniert sein. Der Massenmarkt bleibt {mass_market_years} Jahre entfernt. Die Gewinnzone wird erst nach {profitability_years} Jahren erreicht.",
    ],
  },
  economist: {
    analysis: [
      "Ökonomische Analyse unter Anwendung von Spieltheorie und Mechanismusdesign: Das Anreizsystem für '{topic}' erzeugt {incentive_structure}. Die Nash-Gleichgewichte sind: {nash_equilibria}. Das effiziente Gleichgewicht wird bei {efficient_eq} erreicht.",
      "Makroökonomische Sensitivität: Eine Änderung des Leitzinses um {rate_change} Basispunkte verschiebt die NPV-Rechnung um {npv_shift}%. Bei {inflation_scenario} Inflationsszenario ändert sich die gesamte Wirtschaftlichkeit.",
    ],
    prediction: [
      "Ökonomische Prognose: Die allokative Effizienz von '{topic}' wird in {timeframe} {efficiency_assessment} sein. Die ökonomische Rente wird sich zu {rent_distribution}% bei Innovatoren, {incumbent_share}% bei Inkumbenten, und {consumer_surplus}% als Konsumentenrente verteilen.",
    ],
  },
  regulatory: {
    analysis: [
      "Regulatorische Gap-Analyse: '{topic}' überschneidet sich mit {regulatory_areas} Rechtsbereichen. Davon sind {regulated} bereits reguliert, {emerging} im Entstehen, und {unregulated} völlig ungeregelt. Die regulatorische Unsicherheit beträgt {uncertainty_score}/10.",
      "Die Veto-Player-Analyse nach Tsebelis ergibt: {veto_players} Veto-Spieler mit einer Policy-Distanz von {policy_distance}. Das bedeutet: Policy-Change ist {policy_change_likelihood}. Die Agenda-Setting-Phase allein wird {agenda_phase} Monate dauern.",
    ],
    prediction: [
      "Regulatorische Prognose: In {timeframe} wird '{topic}' in {leading_j} Jurisdiktionen klar reguliert sein, in {ambiguous_j} mehrdeutig, und in {blocking_j} blockiert. Der Brussels Effect wird {brussels_effect}.",
    ],
  },
  psychologist: {
    analysis: [
      "Verhaltensanalyse: Die Adoption von '{topic}' hängt von {behavioral_factors} Verhaltensfaktoren ab. Die Theory of Planned Behavior sagt: Verhaltensabsicht = {attitude_weight}×Einstellung + {sn_weight}×Subjektive Norm + {pbc_weight}×wahrgenommene Verhaltenskontrolle. Die Werte für '{topic}': {attitude_score}, {sn_score}, {pbc_score}.",
      "Kognitive Verzerrungs-Check: In der aktuellen Debatte identifiziere ich {bias_count} systematische Verzerrungen: {bias_list}. Jede davon verzerrt die Wahrscheinlichkeitsschätzung um durchschnittlich {bias_impact}%.",
    ],
    prediction: [
      "Verhaltensvorhersage: Die psychologische Adoption-Kurve wird um {adoption_lag} Monate langsamer verlaufen als die technologische Reife-Kurve. Der Grund: {psychological_reason}. Die kritische Masse wird bei {critical_mass_psych}% erreicht, nicht bei {technical_threshold}%.",
    ],
  },
  security: {
    analysis: [
      "Bedrohungslandschaft: '{topic}' exponiert {attack_surfaces} Angriffsflächen. Die STRIDE-Analyse identifiziert: {stride_results}. Das aggregierte Risiko-Rating ist {risk_rating}/10.",
      "Szenario-Planning (nach Schwartz): Die vier Zukunftsszenarien für '{topic}' sind: (1) {scenario_1} – Wahrscheinlichkeit {prob_1}%, (2) {scenario_2} – {prob_2}%, (3) {scenario_3} – {prob_3}%, (4) {scenario_4} – {prob_4}%.",
    ],
    stress_test: [
      "Red-Team-Analyse: Wenn ich '{topic}' absichtlich sabotieren wollte, wäre der effektivste Angriffsvektor {attack_vector}. Die Wahrscheinlichkeit erfolgreicher Sabotage liegt bei {sabotage_prob}%. Die Resilienz gegen diesen Vektor ist {resilience_rating}/10.",
    ],
    prediction: [
      "Risk-Prognose: In {timeframe} werden {incident_count} sicherheitsrelevante Vorfälle mit '{topic}' auftreten (Konfidenz: {incident_confidence}%). Das Schadenspotenzial liegt bei {damage_potential} Mrd. EUR im Worst-Case.",
    ],
  },
  historian: {
    analysis: [
      "Historische Analogie-Analyse: Von {analogies} identifizierten Parallelen ist {best_analogy} die stärkste (Ähnlichkeits-Score: {similarity_score}/10). Der historische Verlauf war: {historical_trajectory}. Die Übertragbarkeit auf '{topic}' ist {transferability}.",
      "Langzeitzyklus-Analyse (Kondratjew/Braudel): '{topic}' passt in den {cycle_type}-Zyklus, der {cycle_length} Jahre dauert. Die aktuelle Position im Zyklus ist {cycle_position}, was {cycle_implication} bedeutet.",
    ],
    critique: [
      "Historische Warnung: In {historical_failures}% ähnlicher Fälle führte die gleiche Kombination aus {warning_factors} zum Scheitern. Wir überschätzen unsere Einzigartigkeit und unterschätzen historische Muster. Das ist Historical Amnesia.",
    ],
    prediction: [
      "Historische Projektion: Basierend auf {historical_cases} Vergleichsfällen liegt die Wahrscheinlichkeit für {predicted_outcome} bei {historical_prob}%. Die Streuung der historischen Vergleiche beträgt ±{historical_spread} Jahre.",
    ],
  },
  ethicist: {
    analysis: [
      "Ethische Prisma-Analyse unter vier Rahmen: (1) Utilitaristisch: Netto-Nutzen für {stakeholders} Stakeholder = {net_utility}. (2) Deontologisch: Pflichten gegenüber {duty_bearers} = {duty_assessment}. (3) Tugendethisch: Charakterbildungseffekt = {virtue_effect}. (4) Fürsorgeethik: Vulnerabilitäts-Impact = {care_impact}.",
      "Gerechtigkeitsanalyse (Rawls' Differenzprinzip): '{topic}' begünstigt die {advantaged_group} und benachteiligt die {disadvantaged_group}. Der Gini-Koeffizient würde sich um {gini_change} verschieben. Das Differenzprinzip ist {difference_principle} erfüllt.",
    ],
    critique: [
      "Ethische Intervention: Wir müssen die Frage stellen, die niemand stellt: Wer hat das RECHT, über '{topic}' zu entscheiden? Die Demokratiedefizite in der Governance von '{topic}' sind: {democracy_gaps}. Das ist nicht nur ein Effizienzproblem, sondern ein Legitimationsproblem.",
    ],
    prediction: [
      "Ethische Prognose: In {timeframe} wird '{topic}' {ethical_status} sein. Die ethische Debatte wird {ethical_debate_intensity} geführt werden. Mindestens {ethical_conflicts} ethische Konflikte werden öffentlich eskalieren.",
    ],
  },
  sociologist: {
    analysis: [
      "Sozialstrukturelle Analyse: Die Adoption von '{topic}' folgt dem Diffusionsmuster: Innovatoren ({innovator_pct}%) → Frühe Adopter ({early_adopter_pct}%) → Frühe Mehrheit ({early_majority_pct}%) → Späte Mehrheit ({late_majority_pct}%) → Nachzügler ({laggard_pct}%). Der aktuelle Status: {diffusion_status}.",
      "Soziale Netzwerkanalyse: Die Diffusion hängt von {key_nodes} Schlüsselakteuren ab (Betweenness-Centrality > {centrality_threshold}). Ohne deren Adoption bleibt '{topic}' in einer Nische. Die Netzwerkdichte im relevanten Graph ist {network_density}.",
    ],
    prediction: [
      "Soziale Vorhersage: Die soziale Diffusion wird in {timeframe} den Punkt {diffusion_milestone} erreichen. Die soziale Kluft (Digital Divide / Adoption Divide) wird sich um {divide_change}% verändern. Soziale Kohäsion: {cohesion_impact}.",
    ],
  },
  systems_thinker: {
    analysis: [
      "Systemarchetyp-Analyse: '{topic}' folgt dem Muster des {system_archetype}. Das bedeutet: Die kurzfristige Wirkung ist {short_term_effect}, die langfristige Wirkung ist {long_term_effect}. Das Verzögerungselement beträgt {delay_time} Monate.",
      "Feedback-Loop-Analyse: Positive Verstärkung durch {positive_loops} (R1-R{positive_count}). Negative Dämpfung durch {negative_loops} (B1-B{negative_count}). Das Systemverhalten wird dominiert von Loop {dominant_loop}, was {dominant_behavior} erzeugt.",
    ],
    synthesis: [
      "Systemische Synthese: Die Lösung liegt nicht in der Optimierung einzelner Komponenten, sondern in der Restrukturierung der Beziehungen. Der Hebelpunkt mit maximaler Wirkung bei minimalem Eingriff ist: {leverage_point}. Das ist das {leverage_level}. Hebelpunkt-Prinzip.",
    ],
    prediction: [
      "Systemvorhersage: Das System wird in {timeframe} ein neues Gleichgewicht bei {new_equilibrium} erreichen. Das Übergangsverhalten zeigt {transition_pattern} mit einer Halbwertszeit von {half_life} Monaten. Resilienz gegen Störungen: {resilience_score}/10.",
    ],
  },
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function interpolate(template: string, topic: string, meta: ReturnType<typeof extractKeywords>): string {
  const { timeframe } = meta;
  let result = template
    .replace(/\{topic\}/g, topic)
    .replace(/\{timeframe\}/g, timeframe);

  // Numeric placeholders with ranges
  result = result.replace(/\{count\}/g, String(Math.floor(Math.random() * 80 + 20)));
  result = result.replace(/\{mean\}/g, (Math.random() * 50 + 25).toFixed(1));
  result = result.replace(/\{median\}/g, (Math.random() * 40 + 20).toFixed(1));
  result = result.replace(/\{std\}/g, (Math.random() * 15 + 5).toFixed(1));
  result = result.replace(/\{skewness\}/g, (Math.random() * 2 - 0.5).toFixed(2));
  result = result.replace(/\{probability\}/g, String(Math.floor(Math.random() * 40 + 30)));
  result = result.replace(/\{effect_size\}/g, (Math.random() * 1.2 + 0.2).toFixed(2));
  result = result.replace(/\{r_squared\}/g, (Math.random() * 0.4 + 0.3).toFixed(3));
  result = result.replace(/\{sample\}/g, String(Math.floor(Math.random() * 8000 + 2000)));
  result = result.replace(/\{p_value\}/g, (Math.random() * 0.05).toFixed(4));
  result = result.replace(/\{ci_factor\}/g, (Math.random() * 1.5 + 1.2).toFixed(1));
  result = result.replace(/\{auroc\}/g, (Math.random() * 0.2 + 0.7).toFixed(3));
  result = result.replace(/\{percentile\}/g, String(Math.floor(Math.random() * 40 + 30)));
  result = result.replace(/\{hattie_effect\}/g, (Math.random() * 0.8 + 0.1).toFixed(2));
  result = result.replace(/\{trl\}/g, String(Math.floor(Math.random() * 5 + 3)));
  result = result.replace(/\{debt\}/g, String(Math.floor(Math.random() * 30 + 10)));
  result = result.replace(/\{gini\}/g, (Math.random() * 0.4 + 0.3).toFixed(2));
  result = result.replace(/\{hhi\}/g, String(Math.floor(Math.random() * 2000 + 1000)));
  result = result.replace(/\{multiplier\}/g, (Math.random() * 1.5 + 1.1).toFixed(2));
  result = result.replace(/\{elasticity\}/g, (Math.random() * 1.5 + 0.3).toFixed(2));
  result = result.replace(/\{discount_rate\}/g, String(Math.floor(Math.random() * 5 + 5)));
  result = result.replace(/\{npv\}/g, String(Math.floor(Math.random() * 50 + 10)));
  result = result.replace(/\{wtp\}/g, String(Math.floor(Math.random() * 500 + 50)));
  result = result.replace(/\{cost\}/g, String(Math.floor(Math.random() * 500 + 100)));
  result = result.replace(/\{gap\}/g, String(Math.floor(Math.random() * 40 + 10)));
  result = result.replace(/\{roi\}/g, String(Math.floor(Math.random() * 300 + 50)));
  result = result.replace(/\{growth_rate\}/g, String(Math.floor(Math.random() * 30 + 10)));
  result = result.replace(/\{market_size\}/g, String(Math.floor(Math.random() * 200 + 50)));
  result = result.replace(/\{penetration\}/g, String(Math.floor(Math.random() * 40 + 20)));
  result = result.replace(/\{carbon_direct\}/g, (Math.random() * 10 + 0.1).toFixed(2));
  result = result.replace(/\{icer\}/g, String(Math.floor(Math.random() * 50000 + 10000)));
  result = result.replace(/\{median_age\}/g, String(Math.floor(Math.random() * 15 + 35)));
  result = result.replace(/\{critical_mass\}/g, String(Math.floor(Math.random() * 20 + 15)));
  result = result.replace(/\{uai_high\}/g, String(Math.floor(Math.random() * 20 + 70)));
  result = result.replace(/\{simulations\}/g, String(Math.floor(Math.random() * 40000 + 10000)));
  result = result.replace(/\{p5\}/g, (Math.random() * -10).toFixed(1));
  result = result.replace(/\{p95\}/g, (Math.random() * 50 + 30).toFixed(1));

  // Category placeholders
  result = result.replace(/\{foundation\}/g, pickRandom(["Cloud-native", "KI-basiert", "Edge-Computing", "Quantum-ready", "Open-Source"]));
  result = result.replace(/\{critical_factor\}/g, pickRandom(["die Latenz-Optimierung", "die Datenverarbeitung", "die Skalierungsarchitektur", "die Sicherheitsprotokolle", "die Benutzererfahrung"]));
  result = result.replace(/\{interpretation\}/g, pickRandom(["eine gesunde Diversifikation", "eine Konzentration bei wenigen Playern", "ein frühes Entwicklungsstadium", "eine Reifephase"]));
  result = result.replace(/\{arch_type\}/g, pickRandom(["verteilte", "monolithische", "hybride", "event-driven", "service-orientierte"]));
  result = result.replace(/\{bottleneck\}/g, pickRandom(["Datenintegration", "API-Limitierungen", "Organisationsstrukturen", "Legacy-Systeme", "Talentverfügbarkeit"]));
  result = result.replace(/\{convergence_techs\}/g, pickRandom(["KI + IoT + 5G", "Blockchain + DeFi + RegTech", "Biotech + AI + Genomics", "Quantum + ML + Cloud", "AR + 5G + Edge"]));
  result = result.replace(/\{adjacent_sector\}/g, pickRandom(["Gesundheitsprävention", "Bildungstechnologie", "nachhaltige Landwirtschaft", "dezentrale Energie", "prädiktive Wartung"]));
  result = result.replace(/\{black_swan_prob\}/g, String(Math.floor(Math.random() * 15 + 5)));
  result = result.replace(/\{convergence_tech\}/g, pickRandom(["generative KI", "Quantencomputing", "dezentrale Infrastrukturen", "neuromorphe Chips", "DNA-Speicher"]));
  result = result.replace(/\{model\}/g, pickRandom(["Bayesianisches Hierarchisches", "Random Forest", "LSTM-Neuronales Netz", "Prophet-Zeitreihen", "System Dynamics"]));
  result = result.replace(/\{alt_model\}/g, pickRandom(["linearer Regression", "einfachem Exponential Smoothing", "ARIMA", "einem Naive-Baseline-Modell"]));
  result = result.replace(/\{reduction\}/g, String(Math.floor(Math.random() * 30 + 10)));
  result = result.replace(/\{counter_examples\}/g, String(Math.floor(Math.random() * 20 + 5)));
  result = result.replace(/\{counter_pct\}/g, String(Math.floor(Math.random() * 30 + 40)));
  result = result.replace(/\{diseconomies_threshold\}/g, String(Math.floor(Math.random() * 50000 + 50000)));
  result = result.replace(/\{learning_rate\}/g, String(Math.floor(Math.random() * 20 + 15)));
  result = result.replace(/\{cost_parity_years\}/g, String(Math.floor(Math.random() * 4 + 2)));
  result = result.replace(/\{hype_phase\}/g, pickRandom(["3 (Peak of Inflated Expectations)", "2 (Slope of Enlightenment)", "4 (Trough of Disillusionment)"]));
  result = result.replace(/\{trough_time\}/g, String(Math.floor(Math.random() * 12 + 6)));
  result = result.replace(/\{pmf_prob\}/g, String(Math.floor(Math.random() * 30 + 40)));
  result = result.replace(/\{gtm_prob\}/g, String(Math.floor(Math.random() * 30 + 35)));
  result = result.replace(/\{sca_prob\}/g, String(Math.floor(Math.random() * 25 + 30)));
  result = result.replace(/\{combined_prob\}/g, String(Math.floor(Math.random() * 20 + 15)));
  result = result.replace(/\{threat_new\}/g, pickRandom(["hoch", "mittel", "niedrig"]));
  result = result.replace(/\{supplier_power\}/g, pickRandom(["hoch", "mittel", "niedrig"]));
  result = result.replace(/\{threat_substitute\}/g, pickRandom(["hoch", "mittel", "niedrig"]));
  result = result.replace(/\{rivalry\}/g, pickRandom(["intensiv", "moderat", "schwach"]));
  result = result.replace(/\{porter_score\}/g, String(Math.floor(Math.random() * 4 + 3)));
  result = result.replace(/\{jurisdiction_a\}/g, pickRandom(["USA", "China", "Singapur", "Estland", "Schweiz"]));
  result = result.replace(/\{jurisdiction_b\}/g, pickRandom(["EU", "UK", "Japan", "Südkorea", "Indien"]));
  result = result.replace(/\{arbitrage_years\}/g, String(Math.floor(Math.random() * 3 + 1)));
  result = result.replace(/\{rate_change\}/g, String(Math.floor(Math.random() * 200 + 50)));
  result = result.replace(/\{npv_shift\}/g, String(Math.floor(Math.random() * 20 + 5)));
  result = result.replace(/\{efficiency_assessment\}/g, pickRandom(["moderat positiv", "signifikant positiv", "neutral", "suboptimal"]));
  result = result.replace(/\{veto_players\}/g, String(Math.floor(Math.random() * 4 + 2)));
  result = result.replace(/\{policy_distance\}/g, (Math.random() * 2 + 0.5).toFixed(1));
  result = result.replace(/\{policy_change_likelihood\}/g, pickRandom(["unwahrscheinlich", "möglich aber schwierig", "wahrscheinlich"]));
  result = result.replace(/\{regulatory_areas\}/g, String(Math.floor(Math.random() * 5 + 3)));
  result = result.replace(/\{uncertainty_score\}/g, String(Math.floor(Math.random() * 4 + 4)));
  result = result.replace(/\{leading_j\}/g, String(Math.floor(Math.random() * 3 + 2)));
  result = result.replace(/\{ambiguous_j\}/g, String(Math.floor(Math.random() * 5 + 3)));
  result = result.replace(/\{blocking_j\}/g, String(Math.floor(Math.random() * 3 + 1)));
  result = result.replace(/\{brussels_effect\}/g, pickRandom(["moderat", "stark", "begrenzt", "nicht vorhanden"]));
  result = result.replace(/\{innovator_pct\}/g, String((Math.random() * 1.5 + 2).toFixed(1)));
  result = result.replace(/\{early_adopter_pct\}/g, String((Math.random() * 3.5 + 13).toFixed(1)));
  result = result.replace(/\{early_majority_pct\}/g, String((Math.random() * 4 + 34).toFixed(1)));
  result = result.replace(/\{attitude_score\}/g, (Math.random() * 2 + 2).toFixed(1));
  result = result.replace(/\{sn_score\}/g, (Math.random() * 2 + 2).toFixed(1));
  result = result.replace(/\{pbc_score\}/g, (Math.random() * 2 + 2).toFixed(1));
  result = result.replace(/\{bias_count\}/g, String(Math.floor(Math.random() * 3 + 2)));
  result = result.replace(/\{bias_impact\}/g, String(Math.floor(Math.random() * 15 + 5)));
  result = result.replace(/\{adoption_lag\}/g, String(Math.floor(Math.random() * 18 + 6)));
  result = result.replace(/\{critical_mass_psych\}/g, String(Math.floor(Math.random() * 15 + 35)));
  result = result.replace(/\{risk_rating\}/g, String(Math.floor(Math.random() * 4 + 4)));
  result = result.replace(/\{attack_surfaces\}/g, String(Math.floor(Math.random() * 5 + 3)));
  result = result.replace(/\{resilience_rating\}/g, String(Math.floor(Math.random() * 4 + 4)));
  result = result.replace(/\{scenario_1\}/g, pickRandom(["Optimales Wachstum", "Technologischer Durchbruch", "Massenadoption"]));
  result = result.replace(/\{scenario_2\}/g, pickRandom(["Regulatorische Blockade", "Marktkonsolidierung", "Nischenstatus"]));
  result = result.replace(/\{scenario_3\}/g, pickRandom(["Sozialer Widerstand", "Technologie-Dead-End", "Fragmentierung"]));
  result = result.replace(/\{scenario_4\}/g, pickRandom(["Disruption durch Nachfolger", "Globaler Standard", "Totaler Zusammenbruch"]));
  result = result.replace(/\{sabotage_prob\}/g, String(Math.floor(Math.random() * 15 + 5)));
  result = result.replace(/\{similarity_score\}/g, String(Math.floor(Math.random() * 3 + 5)));
  result = result.replace(/\{transferability\}/g, pickRandom(["mittel", "hoch", "begrenzt", "bedingt"]));
  result = result.replace(/\{historical_failures\}/g, String(Math.floor(Math.random() * 20 + 30)));
  result = result.replace(/\{historical_prob\}/g, String(Math.floor(Math.random() * 30 + 40)));
  result = result.replace(/\{stakeholders\}/g, String(Math.floor(Math.random() * 5 + 5)));
  result = result.replace(/\{net_utility\}/g, pickRandom(["positiv", "gemischt", "neutral", "negativ"]));
  result = result.replace(/\{difference_principle\}/g, pickRandom(["teilweise", "nicht", "bedingt"]));
  result = result.replace(/\{system_archetype\}/g, pickRandom(["Limits to Growth", "Shifting the Burden", "Tragedy of the Commons", "Success to the Successful", "Fixes that Fail"]));
  result = result.replace(/\{dominant_behavior\}/g, pickRandom(["oszierendes Wachstum", "Kollaps nach Delay", "S-förmiges Wachstum", "asymptotisches Plateau"]));
  result = result.replace(/\{leverage_point\}/g, pickRandom(["die Informationsstruktur", "die Anreizmechanismen", "die Regelstruktur", "das Zielsystem", "das Denkparadigma"]));
  result = result.replace(/\{resilience_score\}/g, String(Math.floor(Math.random() * 3 + 5)));

  // Generic fillers
  result = result.replace(/\{condition\}/g, pickRandom(["klare regulatorische Rahmenbedingungen", "nachweisbare Skaleneffekte", "breite gesellschaftliche Akzeptanz", "nachhaltige Finanzierung", "technologische Reife"]));
  result = result.replace(/\{conditions\}/g, pickRandom(["klaren regulatorischen Rahmenbedingungen UND nachweisbaren Skaleneffekten", "breiter gesellschaftlicher Akzeptanz UND nachhaltiger Finanzierung", "technologischer Reife UND ökonomischer Tragfähigkeit"]));
  result = result.replace(/\{assumption_prob\}/g, String(Math.floor(Math.random() * 30 + 30)));
  result = result.replace(/\{claimed_prob\}/g, String(Math.floor(Math.random() * 30 + 50)));
  result = result.replace(/\{corrected_prob\}/g, String(Math.floor(Math.random() * 25 + 15)));
  result = result.replace(/\{failure_conditions\}/g, pickRandom([" regulatorische Blockade, technologisches Scheitern, fehlende Nachfrage", "sozialer Widerstand, wirtschaftliche Unattraktivität, mangelnde Skalierbarkeit", "politische Instabilität, konkurrierende Technologien, ethische Bedenken"]));
  result = result.replace(/\{failure_prob\}/g, String(Math.floor(Math.random() * 25 + 15)));
  result = result.replace(/\{min_prob\}/g, String(Math.floor(Math.random() * 20 + 10)));
  result = result.replace(/\{max_prob\}/g, String(Math.floor(Math.random() * 30 + 50)));
  result = result.replace(/\{distribution\}/g, pickRandom(["bimodal", "rechtsschief", "linksschief", "leptokurtisch"]));
  result = result.replace(/\{min_outcome\}/g, pickRandom(["Nischenlösung mit begrenzter Reichweite", "Pilotprojekt-Status ohne Skalierung", "technische Machbarkeit ohne wirtschaftliche Tragfähigkeit"]));
  result = result.replace(/\{max_outcome\}/g, pickRandom(["Mainstream-Transformation des Sektors", "globale Standardlösung", "disruptiver Wandel mit Netzwerkeffekten"]));
  result = result.replace(/\{convergence_points\}/g, pickRandom(["technologische Machbarkeit, regulatorische Notwendigkeit, ökonomische Tragfähigkeit", "gesellschaftlicher Nutzen, technologische Reife, Marktpotenzial", "ethische Vertretbarkeit, wissenschaftliche Fundierung, praktische Umsetzbarkeit"]));
  result = result.replace(/\{dissent_points\}/g, pickRandom(["Zeithorizont, Marktdurchdringung, Risikoverteilung", "Adoptionsgeschwindigkeit, regulatorische Details, Kostenstruktur"]));
  result = result.replace(/\{old_prob\}/g, String(Math.floor(Math.random() * 20 + 10)));
  result = result.replace(/\{new_prob\}/g, String(Math.floor(Math.random() * 30 + 40)));
  result = result.replace(/\{agreed_prob\}/g, String(Math.floor(Math.random() * 25 + 40)));
  result = result.replace(/\{agreed_outcome\}/g, pickRandom(["eine substanzielle Veränderung", "eine moderate Transformation", "eine schrittweise Einführung"]));
  result = result.replace(/\{agreed_condition\}/g, pickRandom(["keine unvorhergesehenen regulatorischen Blockaden", "stabile wirtschaftliche Rahmenbedingungen", "fortlaufende technologische Verbesserung"]));
  result = result.replace(/\{prediction\}/g, pickRandom(["die prognostizierte Marktdurchdringung", "das erwartete Wachstum", "die vorhergesagte Adoption"]));
  result = result.replace(/\{historical_period\}/g, pickRandom(["2000-2010", "2010-2020", "2008-2018", "2015-2025"]));
  result = result.replace(/\{correlation\}/g, (Math.random() * 0.4 + 0.4).toFixed(2));
  result = result.replace(/\{outlier_event\}/g, pickRandom(["die Finanzkrise 2008", "die COVID-19-Pandemie", "die Dotcom-Blase"]));
  result = result.replace(/\{alt_method\}/g, pickRandom(["Bayesianischer Ansatz", "Monte-Carlo-Simulation", "Delphi-Methode", "Szenarioanalyse"]));
  result = result.replace(/\{alt_result\}/g, String(Math.floor(Math.random() * 30 + 40)));
  result = result.replace(/\{deviation\}/g, String(Math.floor(Math.random() * 15 + 5)));
  result = result.replace(/\{judgement\}/g, pickRandom(["plausibel", "vorsichtig optimistisch", "realistisch", "mit Vorbehalten"]));
  result = result.replace(/\{implication\}/g, pickRandom(["eine substanzielle Marktveränderung", "eine moderate Disruption", "eine schrittweise Evolution"]));
  result = result.replace(/\{benchmark\}/g, pickRandom(["historischen Vergleichsfällen", "internationalen Standards", "industriellen Durchschnittswerten"]));
  result = result.replace(/\{black_swan_combo\}/g, pickRandom(["Rezession + regulatorischer Schock + Technologiefehler", "Pandemie + Währungskrise + politische Instabilität", "Krieg + Energiekrise + Cyberangriff"]));
  result = result.replace(/\{distribution_shift\}/g, String(Math.floor(Math.random() * 30 + 20)));
  result = result.replace(/\{agent_count\}/g, String(AGENTS.length));
  result = result.replace(/\{agreement_points\}/g, String(Math.floor(Math.random() * 4 + 4)));
  result = result.replace(/\{dissent_points\}/g, String(Math.floor(Math.random() * 3 + 1)));
  result = result.replace(/\{open_points\}/g, String(Math.floor(Math.random() * 2 + 1)));
  result = result.replace(/\{consistency_check\}/g, String(Math.floor(Math.random() * 3 + 0)));
  result = result.replace(/\{coherence\}/g, String(Math.floor(Math.random() * 10 + 85)));
  result = result.replace(/\{consensus_level\}/g, String(Math.floor(Math.random() * 15 + 70)));
  result = result.replace(/\{alternative_count\}/g, String(Math.floor(Math.random() * 2 + 2)));
  result = result.replace(/\{main_outcome\}/g, pickRandom(["einer substantiellen Transformation des Sektors", "einer breiten Adoption mit messbaren Effekten", "einer schrittweisen Integration in bestehende Strukturen"]));

  // Timeframe-specific
  result = result.replace(/\{lower_ci\}/g, String(Math.floor(Math.random() * 15 + 20)));
  result = result.replace(/\{upper_ci\}/g, String(Math.floor(Math.random() * 15 + 65)));
  result = result.replace(/\{confidence\}/g, String(Math.floor(Math.random() * 15 + 65)));

  return result;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getSentiment(agent: Agent, phase: Phase): EngineMessage["sentiment"] {
  const bias = agent.bias;
  if (phase === "critique" || phase === "debate" || phase === "antithesis") {
    if (bias < -0.4) return "negative";
    if (bias > 0.6) return "excited";
    return "concerned";
  }
  if (phase === "stress_test") {
    return bias < -0.2 ? "concerned" : "neutral";
  }
  if (phase === "consensus_building" || phase === "synthesis") {
    return bias > 0.2 ? "positive" : "neutral";
  }
  if (phase === "prediction" || phase === "validation") {
    if (bias < -0.3) return "concerned";
    if (bias > 0.5) return "excited";
    return "neutral";
  }
  if (bias > 0.5) return "excited";
  if (bias > 0.1) return "positive";
  if (bias < -0.3) return "concerned";
  return "neutral";
}

// ============================================================
// MAIN GENERATION ENGINE
// ============================================================

export function generateDiscussion(topic: string): EngineMessage[] {
  const meta = extractKeywords(topic);
  const { domain } = meta;
  const messages: EngineMessage[] = [];

  const domainTemplates = DOMAIN_TEMPLATES[domain] || DOMAIN_TEMPLATES.allgemein;

  // Phase definitions with how many messages per agent
  const phaseConfigs: { phase: Phase; messagesPerAgent: number; isHighlight: boolean }[] = [
    { phase: "analysis", messagesPerAgent: 1, isHighlight: false },
    { phase: "brainstorming", messagesPerAgent: 1, isHighlight: false },
    { phase: "critique", messagesPerAgent: 1, isHighlight: false },
    { phase: "debate", messagesPerAgent: 2, isHighlight: false }, // Extended debate
    { phase: "antithesis", messagesPerAgent: 1, isHighlight: true },
    { phase: "synthesis", messagesPerAgent: 1, isHighlight: true },
    { phase: "stress_test", messagesPerAgent: 1, isHighlight: false },
    { phase: "consensus_building", messagesPerAgent: 2, isHighlight: true }, // Extended consensus
    { phase: "validation", messagesPerAgent: 1, isHighlight: false },
    { phase: "prediction", messagesPerAgent: 1, isHighlight: true },
  ];

  for (const { phase, messagesPerAgent, isHighlight } of phaseConfigs) {
    // Sort agents: domain experts first, then by random
    let phaseAgents = [...AGENTS].sort(() => Math.random() - 0.5);

    for (let m = 0; m < messagesPerAgent; m++) {
      for (let i = 0; i < phaseAgents.length; i++) {
        const agent = phaseAgents[i];

        // Pick template
        const phaseTemplates = domainTemplates[phase] || [];
        const agentPhaseTemplates = AGENT_TEMPLATES[agent.id]?.[phase] || [];
        const allTemplates = [...phaseTemplates, ...agentPhaseTemplates];

        if (allTemplates.length === 0) continue;

        let content = interpolate(pickRandom(allTemplates), topic, meta);

        // Reply logic for debate and consensus phases
        let replyToAgentId: string | undefined;
        if ((phase === "debate" || phase === "consensus_building") && i > 0 && Math.random() > 0.3) {
          replyToAgentId = phaseAgents[i - 1].id;
          const replyPrefixes = [
            `${agent.name.split(" ")[1]}: Ich muss Ihnen widersprechen. `,
            `Eine wichtige Ergänzung zu Ihrer Position: `,
            `Wobei ich differenzieren muss: `,
            `Das stimmt nur unter spezifischen Bedingungen. `,
            `Ich schließe mich teilweise an, aber mit einer wesentlichen Einschränkung: `,
            `Genau, und darauf aufbauend lässt sich sagen: `,
            `Ich kann das bestätigen, aber nur mit der Präzisierung: `,
            `Interessanter Punkt. Allerdings zeigt die Analyse: `,
          ];
          content = pickRandom(replyPrefixes) + content.charAt(0).toLowerCase() + content.slice(1);
        }

        messages.push({
          agentId: agent.id,
          phase,
          content,
          sentiment: getSentiment(agent, phase),
          replyToAgentId,
          isHighlight: isHighlight && m === messagesPerAgent - 1,
        });
      }
    }
  }

  return messages;
}

// ============================================================
// PREDICTION WITH CONSENSUS CHECK
// ============================================================

export function generatePrediction(topic: string): PredictionResult {
  const meta = extractKeywords(topic);
  const { domain, timeframe } = meta;

  // Calculate pseudo-consensus based on agent biases
  const avgBias = AGENTS.reduce((sum, a) => sum + a.bias, 0) / AGENTS.length;
  const biasVariance = AGENTS.reduce((sum, a) => sum + Math.pow(a.bias - avgBias, 2), 0) / AGENTS.length;

  // Higher variance = lower consensus
  const consensusLevel = Math.max(0, Math.min(100, Math.floor(100 - biasVariance * 200)));
  const consensusRequired = 65;

  const domainScenarios: Record<string, { main: string[]; alternatives: string[] }> = {
    technologie: {
      main: [
        `Weitverbreitete technologische Integration von '${topic}' mit signifikanter Marktdurchdringung und etablierten Standards`,
        `'${topic}' als etablierter Industriestandard mit ausgereifter Ökosystem-Infrastruktur`,
        `Disruptiver aber stabiler Wandel durch '${topic}' in Kernsektoren der Wirtschaft`,
      ],
      alternatives: [
        `Nischenlösung ohne breite Marktdurchdringung`,
        `Technologisches Scheitern aufgrund unerwarteter Limitationen`,
        `Von nachfolgender Technologiegeneration überholt`,
      ],
    },
    wirtschaft: {
      main: [
        `Markttransformation mit neuen Wertschöpfungsketten und etablierten Geschäftsmodellen um '${topic}'`,
        `Ökonomische Konsolidierung mit '${topic}' als profitabler Kerngeschäftsbereich führender Unternehmen`,
        `Struktureller Wandel mit '${topic}' als nachweisbarem Produktivitätstreiber`,
      ],
      alternatives: [
        `Ökonomische Nische mit begrenzter Rentabilität`,
        `Marktversagen aufgrund regulatorischer Fragmentierung`,
        `Übergang zu nachfolgender Technologiegeneration`,
      ],
    },
    gesellschaft: {
      main: [
        `Gesellschaftliche Normalisierung als akzeptierter Standard im alltäglichen Leben`,
        `Kulturelle Integration mit breiter demografischer Akzeptanz`,
        `Demokratisierung des Zugangs über alle sozialen Schichten`,
      ],
      alternatives: [
        `Polarisierte Akzeptanz mit gesellschaftlicher Spaltung`,
        `Nutzung nur in spezifischen sozialen Milieus`,
        `Aktive gesellschaftliche Ablehnung und Blockade`,
      ],
    },
    politik: {
      main: [
        `Regulatorische Etablierung mit klaren rechtlichen Rahmenbedingungen in führenden Jurisdiktionen`,
        `Politische Institutionalisierung als anerkannter Policy-Bereich`,
        `Internationale Governance-Strukturen mit koordinierten Standards`,
      ],
      alternatives: [
        `Regulatorisches Patchwork mit nationaler Fragmentierung`,
        `Politische Blockade durch Veto-Player`,
        `De-facto-Regulierung durch Marktkräfte statt politische Entscheidung`,
      ],
    },
    umwelt: {
      main: [
        `Messbare ökologische Verbesserung mit quantifizierbaren Umweltindikatoren`,
        `Systemische Integration in Nachhaltigkeitsstrategien von Unternehmen und Staaten`,
        `Skalierbare Klima-Lösung mit nachweisbaren Reduktionseffekten`,
      ],
      alternatives: [
        `Nur symbolischer ökologischer Effekt (Greenwashing)`,
        `Jevons-Paradoxie: Netto-Mehrverbrauch trotz Effizienz`,
        `Ökologischer Schaden durch unerwartete Nebenwirkungen`,
      ],
    },
    gesundheit: {
      main: [
        `Breite medizinische Verfügbarkeit als Standardversorgungsoption`,
        `Standardisierung in klinischen Leitlinien und Versorgungsprotokollen`,
        `Präventive Etablierung mit messbarer Gesundheitsverbesserung`,
      ],
      alternatives: [
        `Nur in Spezialkliniken verfügbar`,
        `Zulassungsverweigerung aufgrund unzureichender Evidenz`,
        `Von überlegener Behandlungsalternative verdrängt`,
      ],
    },
    bildung: {
      main: [
        `Strukturelle Integration in etablierte Bildungskonzepte und Curricula`,
        `Demokratisierung des Zugangs mit reduzierter Bildungsungleichheit`,
        `Transformation der Lernkultur mit nachweisbaren Lernergebnisverbesserungen`,
      ],
      alternatives: [
        `Ergänzendes Tool ohne strukturelle Verankerung`,
        `Verstärkung bestehender Bildungsungleichheiten`,
        `Pendel-Rückkehr zu traditionellen Methoden`,
      ],
    },
    allgemein: {
      main: [
        `Substanzielle Etablierung mit messbarem Einfluss auf den relevanten Kontext`,
        `Mainstream-Adaption mit breiter Akzeptanz und institutionalisierter Verankerung`,
        `Transformative Wirkung über den ursprünglichen Anwendungsbereich hinaus`,
      ],
      alternatives: [
        `Nischenphänomen ohne breitere Bedeutung`,
        `Vorübergehender Hype mit nachfolgender Desillusionierung`,
        `Von nicht-technologischen Faktoren überholt`,
      ],
    },
  };

  const scenarios = domainScenarios[domain] || domainScenarios.allgemein;

  // Deep risks and opportunities
  const risks = [
    `Regulatorische Unsicherheit in Schlüsselmärkten verzögert oder verhindert Skalierung`,
    `Technologische Limitationen zeigen sich erst bei Massenskalierung (Scale-Up-Risiko)`,
    `Soziale Akzeptanz bleibt unter der kritischen Schwelle für Netzwerkeffekte`,
    `Wirtschaftliche Trägheit etablierter Akteure blockiert disruptive Veränderung`,
    `Geopolitische Fragmentierung verhindert globale Standards und Skaleneffekte`,
    `Ethische und gesellschaftliche Bedenken führen zu öffentlichem Widerstand und Protest`,
    `Nicht-lineare Nebenwirkungen (Second-Order-Effects) überkompensieren Primäreffekte`,
    `Konkurrierende Technologien oder Ansätze erreichen schneller die nötige Reife`,
    `Finanzierungslücke zwischen Proof-of-Concept und kommerzieller Skalierung`,
    `Wissens- und Kompetenzlücke in der Belegschaft verzögert Implementierung`,
  ];

  const opportunities = [
    `First-Mover-Vorteile in einem neu entstehenden Marktsegment`,
    `Netzwerkeffekte beschleunigen nach Erreichen der kritischen Masse die Verbreitung exponentiell`,
    `Cross-sektorale Synergien eröffnen adjaziente Märkte und Anwendungsgebiete`,
    `Technologische Reifung senkt Kosten und ermöglicht breitere Zugänglichkeit`,
    `Regulatorische Klarheit schafft Planungssicherheit und Investitionsvertrauen`,
    `Soziale Bewegungen und kultureller Wandel treiben Nachfrage organisch voran`,
    `Institutionelle Unterstützung durch politische und ökonomische Entscheidungsträger`,
    `Positive Feedback-Loops zwischen Technologie, Ökonomie und Gesellschaft`,
    `Learning Curve Effects reduzieren Eintrittsbarrieren für neue Akteure`,
    `Internationaler Wissenstransfer beschleunigt globale Adoption`,
  ];

  // Determine if consensus is sufficient
  const hasConsensus = consensusLevel >= consensusRequired;

  // Generate dissenting views if low consensus
  const dissentingViews: string[] = [];
  if (!hasConsensus) {
    const skepticalAgents = AGENTS.filter(a => a.bias < -0.2);
    for (const agent of skepticalAgents.slice(0, 3)) {
      dissentingViews.push(`${agent.name} (${agent.role}): Position bleibt aufgrund ${pickRandom(["methodischer Bedenken", "mangelnder Evidenz", "unzureichender Risikoanalyse", "unbefriedigender ethischer Prüfung"])} unverändert skeptisch.`);
    }
  }

  return {
    scenario: pickRandom(scenarios.main),
    probability: hasConsensus ? Math.floor(Math.random() * 25 + 55) : Math.floor(Math.random() * 20 + 30),
    confidence: hasConsensus ? Math.floor(Math.random() * 20 + 65) : Math.floor(Math.random() * 15 + 35),
    timeframe,
    reasoning: hasConsensus
      ? `Die Delphi-ähnliche Konsensfindung unter ${AGENTS.length} Experten aus ${new Set(AGENTS.map(a => a.field)).size} Fachdisziplinen ergab eine Übereinstimmung von ${consensusLevel}%. Die gewichtete Aggregation aller Positionen – unter Kontrolle individueller Bias-Werte und methodischer Qualitätsstufen – führt zu dieser prognostizierten Entwicklung. Die Synthese berücksichtigt explizit ${risks.slice(0, 4).length} Hauptrisiken und ${opportunities.slice(0, 4).length} Hauptchancen.`
      : `ACHTUNG – KEIN AUSREICHENDER KONSENS ERREICHT. Die Konsensrate von ${consensusLevel}% liegt unter dem erforderlichen Schwellenwert von ${consensusRequired}%. Die Experten sind in wesentlichen Punkten uneinig. Eine verlässliche Punktprognose ist daher methodisch nicht vertretbar. Empfohlen wird: Zusätzliche Analyse der Dissenspunkte, erneute Konsensrunde mit spezifizierten Annahmen, oder explizite Szenario-Darstellung statt Punktprognose.`,
    risks: risks.sort(() => Math.random() - 0.5).slice(0, 5),
    opportunities: opportunities.sort(() => Math.random() - 0.5).slice(0, 5),
    consensusLevel,
    consensusRequired,
    dissentingViews: hasConsensus ? [] : dissentingViews,
    alternativeScenarios: hasConsensus ? scenarios.alternatives.slice(0, 2) : scenarios.alternatives,
  };
}
