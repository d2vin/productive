import { t } from "../trpc";
import { z } from "zod";
import axios from "axios";

export const exampleRouter = t.router({
  hello: t.procedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  getAll: t.procedure.query(({ ctx }) => {
    // return ctx.prisma.example.findMany();
    return ctx.prisma.user.findMany();
  }),
  getVote: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const id = input?.id;
      return ctx.prisma.vote.findUnique({
        where: {
          id: id,
        },
      });
    }),
  getVotes: t.procedure.query(({ ctx }) => {
    // const res = await axios.get(
    //   "https://api.propublica.org/congress/v1/house/votes/recent.json",
    //   {
    //     headers: {
    //       "X-API-Key": "UfkwGLR7qYlW4i0fKxiLJ3kxIFnPp1lJolHy8hw8",
    //     },
    //   }
    // );
    // return res.data;
    return ctx.prisma.vote.findMany();
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
  isSaved: t.procedure
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
  getSponsoredLegislation: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const res = await axios.get(
        `https://api.congress.gov/v3/member/${input.id}/sponsored-legislation/`,
        {
          params: {
            api_key: process.env.CONGRESS_API,
          },
        }
      );
      return res.data;
    }),
  getSenators: t.procedure.query(async ({ ctx }) => {
    return await ctx.prisma.senator.findMany();
  }),
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
  getSenateElections: t.procedure.query(async ({ ctx }) => {
    return await ctx.prisma.senateElection.findMany();
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
