import { t } from "../trpc";
import { z } from "zod";

export const officialRouter = t.router({
  getOfficials: t.procedure.query(async ({ ctx }) => {
    return await ctx.prisma.official.findMany();
  }),
  saveOfficial: t.procedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string(),
        party: z.string(),
        office: z.string().optional(),
        channel: z.string().optional(),
        channelId: z.string().optional(),
        url: z.string().optional(),
        wikiUrl: z.string().optional(),
        photoUrl: z.string().optional(),
        bioguideId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingOfficial = await ctx.prisma.official.findFirst({
        where: {
          userId: ctx?.session?.user?.id,
          name: input.name,
          party: input.party,
        },
      });
      if (!existingOfficial) {
        return await ctx.prisma.official.create({
          data: input,
        });
      } else {
        return null;
      }
    }),
  getSavedOfficials: t.procedure.query(async ({ ctx }) => {
    return await ctx.prisma.official.findMany({
      where: {
        userId: ctx?.session?.user?.id,
      },
    });
  }),
  unsaveOfficial: t.procedure
    .input(z.object({ name: z.string(), party: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const savedOfficial = await ctx.prisma.official.findFirst({
        where: {
          userId: ctx?.session?.user?.id,
          name: input.name,
          party: input.party,
        },
      });
      return await ctx.prisma.official.delete({
        where: {
          id: savedOfficial?.id,
        },
      });
    }),
});
