import { t } from "../trpc";
import { z } from "zod";

export const voteRouter = t.router({
  getVote: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const id = input?.id;
      return await ctx.prisma.vote.findUnique({
        where: {
          id: id,
        },
      });
    }),
  getVotes: t.procedure.query(async ({ ctx }) => {
    return await ctx.prisma.vote.findMany();
  }),
  getSavedVotes: t.procedure.query(async ({ ctx }) => {
    const savedVotes = await ctx.prisma.savedVote.findMany({
      where: {
        userId: ctx.session?.user?.id,
      },
    });
    const votes = [];
    for (let i = 0; i < savedVotes.length; i++) {
      const vote = await ctx.prisma.vote.findFirst({
        where: {
          id: savedVotes[i]?.voteId,
        },
      });
      votes.push(vote);
    }
    return votes;
  }),
  isSavedVote: t.procedure
    .input(z.object({ voteId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.savedVote.findFirst({
        where: {
          voteId: input.voteId,
        },
      });
    }),
  saveVote: t.procedure
    .input(
      z.object({
        userId: z.string(),
        voteId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.savedVote.create({
        data: input,
      });
    }),
  unsaveVote: t.procedure
    .input(
      z.object({
        userId: z.string(),
        voteId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const savedVote = await ctx.prisma.savedVote.findFirst({
        where: {
          userId: input.userId,
          voteId: input.voteId,
        },
      });
      return await ctx.prisma.savedVote.delete({
        where: {
          id: savedVote?.id,
        },
      });
    }),
});
