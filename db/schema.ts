import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  json,
  bigint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export const predictionSessions = mysqlTable("prediction_sessions", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).references(() => users.id),
  topic: varchar("topic", { length: 500 }).notNull(),
  status: mysqlEnum("status", ["running", "completed", "failed", "insufficient_consensus"]).default("running").notNull(),
  currentPhase: mysqlEnum("current_phase", [
    "analysis",
    "brainstorming",
    "critique",
    "debate",
    "antithesis",
    "synthesis",
    "stress_test",
    "consensus_building",
    "validation",
    "prediction",
  ]).default("analysis"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const discussionMessages = mysqlTable("discussion_messages", {
  id: serial("id").primaryKey(),
  sessionId: bigint("session_id", { mode: "number", unsigned: true }).notNull().references(() => predictionSessions.id),
  agentId: varchar("agent_id", { length: 50 }).notNull(),
  phase: mysqlEnum("phase", [
    "analysis",
    "brainstorming",
    "critique",
    "debate",
    "antithesis",
    "synthesis",
    "stress_test",
    "consensus_building",
    "validation",
    "prediction",
  ]).notNull(),
  content: text("content").notNull(),
  sentiment: mysqlEnum("sentiment", ["positive", "negative", "neutral", "concerned", "excited"]).default("neutral"),
  replyToId: bigint("reply_to_id", { mode: "number", unsigned: true }),
  isHighlight: mysqlEnum("is_highlight", ["true", "false"]).default("false").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const predictionOutcomes = mysqlTable("prediction_outcomes", {
  id: serial("id").primaryKey(),
  sessionId: bigint("session_id", { mode: "number", unsigned: true }).notNull().references(() => predictionSessions.id),
  scenario: varchar("scenario", { length: 500 }).notNull(),
  probability: int("probability").notNull(),
  confidence: int("confidence").notNull(),
  timeframe: varchar("timeframe", { length: 100 }).notNull(),
  reasoning: text("reasoning").notNull(),
  risks: json("risks").$type<string[]>(),
  opportunities: json("opportunities").$type<string[]>(),
  consensusLevel: int("consensus_level").default(0).notNull(),
  consensusRequired: int("consensus_required").default(65).notNull(),
  dissentingViews: json("dissenting_views").$type<string[]>(),
  alternativeScenarios: json("alternative_scenarios").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type PredictionSession = typeof predictionSessions.$inferSelect;
export type InsertPredictionSession = typeof predictionSessions.$inferInsert;
export type DiscussionMessage = typeof discussionMessages.$inferSelect;
export type InsertDiscussionMessage = typeof discussionMessages.$inferInsert;
export type PredictionOutcome = typeof predictionOutcomes.$inferSelect;
export type InsertPredictionOutcome = typeof predictionOutcomes.$inferInsert;
