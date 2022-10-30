import { t } from "../trpc";
import { z } from "zod";
import axios from "axios";

export const legislationRouter = t.router({
  getSponsoredLegislation: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.sponsoredLegislation.findMany({
        where: {
          sponsorId: input.id,
        },
      });
    }),
});
