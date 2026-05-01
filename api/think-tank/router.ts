import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { predictionSessions, discussionMessages, predictionOutcomes } from "../../db/schema";
import { eq, desc } from "drizzle-orm";
import { generateDiscussion, generatePrediction } from "./engine";
import { AGENTS } from "./agents";

export const thinkTankRouter = createRouter({
  createSession: authedQuery
    .input(z.object({ topic: z.string().min(3).max(500) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      // Create session
      const [session] = await db.insert(predictionSessions).values({
        userId: ctx.user.id,
        topic: input.topic,
        status: "running",
        currentPhase: "analysis",
      }).$returningId();

      const sessionId = session.id;

      // Generate deep multi-round discussion
      const messages = generateDiscussion(input.topic);

      // Insert messages
      for (const msg of messages) {
        await db.insert(discussionMessages).values({
          sessionId,
          agentId: msg.agentId,
          phase: msg.phase,
          content: msg.content,
          sentiment: msg.sentiment,
          replyToId: null,
          isHighlight: msg.isHighlight ? "true" : "false",
        });
      }

      // Generate prediction with consensus check
      const prediction = generatePrediction(input.topic);
      const hasConsensus = prediction.consensusLevel >= prediction.consensusRequired;

      await db.insert(predictionOutcomes).values({
        sessionId,
        scenario: prediction.scenario,
        probability: prediction.probability,
        confidence: prediction.confidence,
        timeframe: prediction.timeframe,
        reasoning: prediction.reasoning,
        risks: prediction.risks,
        opportunities: prediction.opportunities,
        consensusLevel: prediction.consensusLevel,
        consensusRequired: prediction.consensusRequired,
        dissentingViews: prediction.dissentingViews,
        alternativeScenarios: prediction.alternativeScenarios,
      });

      // Update session status
      await db.update(predictionSessions)
        .set({
          status: hasConsensus ? "completed" : "insufficient_consensus",
          currentPhase: "prediction",
        })
        .where(eq(predictionSessions.id, sessionId));

      return {
        sessionId,
        messageCount: messages.length,
        hasConsensus,
        consensusLevel: prediction.consensusLevel,
        agents: AGENTS.map(a => ({ id: a.id, name: a.name, role: a.role, color: a.color, avatar: a.avatar })),
      };
    }),

  getSession: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      
      const session = await db.query.predictionSessions.findFirst({
        where: eq(predictionSessions.id, input.id),
      });

      if (!session) throw new Error("Session not found");
      if (session.userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const messages = await db.query.discussionMessages.findMany({
        where: eq(discussionMessages.sessionId, input.id),
        orderBy: discussionMessages.id,
      });

      const outcomes = await db.query.predictionOutcomes.findMany({
        where: eq(predictionOutcomes.sessionId, input.id),
      });

      return {
        session,
        messages,
        outcomes,
        agents: AGENTS.map(a => ({ id: a.id, name: a.name, role: a.role, field: a.field, color: a.color, avatar: a.avatar, personality: a.personality, expertise: a.expertise, bias: a.bias, weight: a.weight })),
      };
    }),

  listSessions: authedQuery
    .query(async ({ ctx }) => {
      const db = getDb();
      
      const sessions = await db.query.predictionSessions.findMany({
        where: eq(predictionSessions.userId, ctx.user.id),
        orderBy: desc(predictionSessions.createdAt),
      });

      return sessions;
    }),

  getPublicAgents: publicQuery
    .query(() => {
      return AGENTS.map(a => ({
        id: a.id,
        name: a.name,
        role: a.role,
        field: a.field,
        color: a.color,
        avatar: a.avatar,
        personality: a.personality,
        expertise: a.expertise,
        bias: a.bias,
        weight: a.weight,
      }));
    }),
});
