import { PrismaClient } from "@prisma/client";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const prisma = new PrismaClient();
const doBackfill = async () => {
  const elections = [
    {
      cycle: "2022",
      branch: "Senate",
      district: "WI-S3",
      candidateA: "Mandela Barnes",
      candidateB: "Ron Johnson",
    },
  ];

  const formattedElections = elections.map(
    (election: {
      cycle: string;
      branch: string;
      district: string;
      candidateA: string;
      candidateB: string;
    }) => ({
      cycle: election.cycle,
      branch: election.branch,
      district: election.district,
      candidateA: election.candidateA,
      candidateB: election.candidateB,
    })
  );

  // const creation = await prisma.vote.createMany({
  //   data: formattedElections,
  // });

  // console.log("creation:", creation);
};

doBackfill();
