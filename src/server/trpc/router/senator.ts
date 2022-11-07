import { t } from "../trpc";
import { z } from "zod";

export const senatorRouter = t.router({
  getSenator: t.procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.senator.findFirst({
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
  infiniteSenators: t.procedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        state: z.string().optional(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const items = await ctx.prisma.senator.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        where: {
          state: input.state,
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
    .input(z.object({ senatorId: z.number() }))
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
        senatorId: z.number(),
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
        senatorId: z.number(),
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
