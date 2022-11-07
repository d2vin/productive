import { t } from "../trpc";
import { z } from "zod";

export const representativeRouter = t.router({
  getRepresentative: t.procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.representative.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  getRepresentatives: t.procedure.query(async ({ ctx }) => {
    return await ctx.prisma.representative.findMany();
  }),
  infiniteRepresentatives: t.procedure
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
      const items = await ctx.prisma.representative.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        where: {
          state: input.state
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
  getBookmarkedRepresentatives: t.procedure.query(async ({ ctx }) => {
    const bookmarkedRepresentative =
      await ctx.prisma.bookmarkedRepresentative.findMany({
        where: {
          userId: ctx.session?.user?.id,
        },
      });
    const representatives = [];
    for (let i = 0; i < bookmarkedRepresentative.length; i++) {
      const representative = await ctx.prisma.representative.findFirst({
        where: {
          id: bookmarkedRepresentative[i]?.representativeId,
        },
      });
      representatives.push(representative);
    }
    return representatives;
  }),
  isBookmarkedRepresentative: t.procedure
    .input(z.object({ representativeId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.bookmarkedRepresentative.findFirst({
        where: {
          representativeId: input.representativeId,
          userId: ctx.session?.user?.id,
        },
      });
    }),
  bookmarkRepresentative: t.procedure
    .input(
      z.object({
        userId: z.string(),
        representativeId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.bookmarkedRepresentative.create({
        data: input,
      });
    }),
  unbookmarkRepresentative: t.procedure
    .input(
      z.object({
        userId: z.string(),
        representativeId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const bookmarkedrepresentative =
        await ctx.prisma.bookmarkedRepresentative.findFirst({
          where: {
            userId: input.userId,
            representativeId: input.representativeId,
          },
        });
      return await ctx.prisma.bookmarkedRepresentative.delete({
        where: {
          id: bookmarkedrepresentative?.id,
        },
      });
    }),
});
