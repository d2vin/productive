import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();
const doBackfill = async () => {
  const res = await axios.get(
    "https://api.propublica.org/congress/v1/house/votes/recent.json",
    {
      headers: {
        "X-API-Key": "UfkwGLR7qYlW4i0fKxiLJ3kxIFnPp1lJolHy8hw8",
      },
    }
  );
  const allVotes = res.data.results.votes;
  const formattedVotes = (await allVotes).map(
    (vote: {
      congress?: number;
      chamber?: string;
      roll_call?: number;
      bill: {
        title?: string;
        latest_action?: string;
      };
      description?: string;
      result?: string;
      date?: string;
      democratic?: object;
      republican?: object;
      independent?: object;
      total?: object;
    }) => ({
      congress: vote.congress,
      chamber: vote.chamber,
      rollCall: vote.roll_call,
      title: vote.bill.title,
      latestAction: vote.bill.latest_action,
      description: vote.description,
      result: vote.result,
      date: vote.date,
      demProgress: vote.democratic,
      repProgress: vote.republican,
      indProgress: vote.independent,
      totalProgress: vote.total,
    })
  );

  const creation = await prisma.vote.createMany({
    data: formattedVotes,
  });

  console.log("creation:", creation);
};

doBackfill();
