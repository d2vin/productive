// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { authRouter } from "./auth";
import { electionRouter } from "./election";
import { legislationRouter } from "./legislation";
import { senatorRouter } from "./senator";
import { representativeRouter } from "./representative";
import { voteRouter } from "./vote";
import { officialRouter } from "./official";

export const appRouter = t.router({
  auth: authRouter,
  senator: senatorRouter,
  representative: representativeRouter,
  election: electionRouter,
  legislation: legislationRouter,
  vote: voteRouter,
  official: officialRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
