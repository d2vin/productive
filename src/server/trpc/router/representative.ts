import { t } from "../trpc";
import { z } from "zod";

export const representativeRouter = t.router({
  getRepresentative: t.procedure
    .input(
      z.object({
        id: z.string(),
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
    .input(z.object({ representativeId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.bookmarkedRepresentative.findFirst({
        where: {
          representativeId: input.representativeId,
        },
      });
    }),
  bookmarkRepresentative: t.procedure
    .input(
      z.object({
        userId: z.string(),
        representativeId: z.string(),
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
        representativeId: z.string(),
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
