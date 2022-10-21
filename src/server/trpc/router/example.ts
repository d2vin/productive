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
  getSenators: t.procedure.query(async () => {
    const res = await axios.get(
      "https://api.propublica.org/congress/v1/117/senate/members.json",
      {
        headers: {
          "X-API-Key": "UfkwGLR7qYlW4i0fKxiLJ3kxIFnPp1lJolHy8hw8",
        },
      }
    );
    return res.data;
  }),
  getRepresentatives: t.procedure.query(async () => {
    const res = await axios.get(
      "https://api.propublica.org/congress/v1/117/house/members.json",
      {
        headers: {
          "X-API-Key": "UfkwGLR7qYlW4i0fKxiLJ3kxIFnPp1lJolHy8hw8",
        },
      }
    );
    return res.data;
  }),
});
