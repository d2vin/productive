import { t } from "../trpc";
import { z } from "zod";

export const contestRouter = t.router({
  createContest: t.procedure
    .input(
      z.object({
        ballotTitle: z.string(),
        district: z.string(),
        type: z.string(),
        referendumTitle: z.string().optional(),
        referendumSubtitle: z.string().optional(),
        referendumUrl: z.string().optional(),
        referendumBallotResponse: z.string().optional(),
        candidateId: z.number(),
        votedFor: z.string(),
        candidates: z.object({ name: z.string(), party: z.string() }).array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      for (let i = 0; i < input.candidates.length; i++) {
        return await ctx.prisma.candidate.create({
          data: {
            name: input?.candidates[i]?.name as string,
            party: input?.candidates[i]?.party as string,
          },
        });
      }
      // const creation = await ctx.prisma.userContest.create({
      //   data: {
      //     ballotTitle: input.ballotTitle,
      //     district: input.district,
      //     type: input.type,
      //     referendumTitle: input.referendumTitle,
      //     referendumSubtitle: input.referendumSubtitle,
      //     referendumUrl: input.referendumUrl,
      //     referendumBallotResponse: input.referendumBallotResponse,
      //     userId: ctx?.session?.user?.id,
      //   },
      // });
      // return creation
    }),
});
