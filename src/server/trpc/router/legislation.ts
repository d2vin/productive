import { t } from "../trpc";
import { z } from "zod";
import { Input, Result } from "postcss";

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
  getUserVotesOnSponsoredLegislation: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const votes = await ctx.prisma.userVote.findMany({
        where: {
          userId: input.userId,
        },
      });
      const voteList = [];
      for (let i = 0; i < votes.length; i++) {
        voteList.push(votes?.[i]?.sponsoredLegislationId);
      }
      const legislation = [];
      for (let i = 0; i < voteList.length; i++) {
        const id = voteList[i];
        const vote = await ctx.prisma.sponsoredLegislation.findFirst({
          where: { id: id },
        });
        legislation.push(vote);
      }
      return legislation;
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nextCursor = nextItem!.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
  voteForLegislation: t.procedure
    .input(
      z.object({
        userId: z.string(),
        sponsoredLegislationId: z.number(),
        result: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.userVote.create({
        data: input,
      });
    }),
  unvoteForLegislation: t.procedure
    .input(
      z.object({
        userId: z.string(),
        sponsoredLegislationId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userVote = await ctx.prisma.userVote.findFirst({
        where: {
          userId: input.userId,
          sponsoredLegislationId: input.sponsoredLegislationId,
        },
      });
      return await ctx.prisma.userVote.delete({
        where: {
          id: userVote?.id,
        },
      });
    }),
  getVoteForLegislation: t.procedure
    .input(z.object({ sponsoredLegislationId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.userVote.findFirst({
        where: {
          userId: ctx?.session?.user?.id,
          sponsoredLegislationId: input.sponsoredLegislationId,
        },
      });
    }),
});
