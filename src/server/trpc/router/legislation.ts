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
  infiniteSenatorLegislation: t.procedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const items = await ctx.prisma.sponsoredLegislation.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        where: {
          sponsorMemberType: "senator",
        },
        cursor: cursor ? { id: cursor } : undefined,
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nextCursor = nextItem!.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
  infiniteRepresentativeLegislation: t.procedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const items = await ctx.prisma.sponsoredLegislation.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        where: {
          sponsorMemberType: "representative",
        },
        cursor: cursor ? { id: cursor } : undefined,
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
});
