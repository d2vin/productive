import { t } from "../trpc";
import { z } from "zod";

export const senatorRouter = t.router({
  getSenator: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.senator.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  getSenatorByState: t.procedure
    .input(z.object({ state: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.senator.findMany({
        where: {
          state: input.state,
        },
      });
    }),
  getSenators: t.procedure.query(async ({ ctx }) => {
    return await ctx.prisma.senator.findMany();
  }),
  getBookmarkedSenators: t.procedure.query(async ({ ctx }) => {
    const bookmarkedSenators = await ctx.prisma.bookmarkedSenator.findMany({
      where: {
        userId: ctx.session?.user?.id,
      },
    });
    const senators = [];
    for (let i = 0; i < bookmarkedSenators.length; i++) {
      const senator = await ctx.prisma.senator.findFirst({
        where: {
          id: bookmarkedSenators[i]?.senatorId,
        },
      });
      senators.push(senator);
    }
    return senators;
  }),
  isBookmarkedSenator: t.procedure
    .input(z.object({ senatorId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.bookmarkedSenator.findFirst({
        where: {
          senatorId: input.senatorId,
          userId: ctx.session?.user?.id,
        },
      });
    }),
  bookmarkSenator: t.procedure
    .input(
      z.object({
        userId: z.string(),
        senatorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.bookmarkedSenator.create({
        data: input,
      });
    }),
  unbookmarkSenator: t.procedure
    .input(
      z.object({
        userId: z.string(),
        senatorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const bookmarkedSenator = await ctx.prisma.bookmarkedSenator.findFirst({
        where: {
          userId: input.userId,
          senatorId: input.senatorId,
        },
      });
      return await ctx.prisma.bookmarkedSenator.delete({
        where: {
          id: bookmarkedSenator?.id,
        },
      });
    }),
});
