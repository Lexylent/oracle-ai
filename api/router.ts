import { authRouter } from "./auth-router";
import { thinkTankRouter } from "./think-tank/router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  thinkTank: thinkTankRouter,
});

export type AppRouter = typeof appRouter;
