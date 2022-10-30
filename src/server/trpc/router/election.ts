import { t } from "../trpc";
import { z } from "zod";
import axios from "axios";

export const electionRouter = t.router({
  getSenateElections: t.procedure.query(async ({ ctx }) => {
    return await ctx.prisma.senateElection.findMany();
  }),
});
