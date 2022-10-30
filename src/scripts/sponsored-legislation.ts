import { PrismaClient, Representative, Senator } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

const doBackfill = async () => {
  const officials: (Senator | Representative | undefined)[] = [];
  const senators = await prisma.senator.findMany();
  const representatives = await prisma.representative.findMany();

  for (let i = 0; i < senators.length; i++) {
    officials.push(senators[i]);
  }
  for (let i = 0; i < representatives.length; i++) {
    officials.push(representatives[i]);
  }

  for (let i = 0; officials.length; i++) {
    const res = await axios.get(
      `https://api.congress.gov/v3/member/${officials[i]?.id}/sponsored-legislation/`,
      {
        params: {
          api_key: process.env.CONGRESS_API,
        },
      }
    );
    const allLegislation = res.data.sponsoredLegislation;
    const formattedLegislation = (await allLegislation).map(
      (legislation: {
        congress: number;
        latestAction: {
          actionDate?: string;
          text?: string;
        };
        number: number;
        policyArea: {
          name?: string;
        };
        title: string;
        type: string;
        url: string;
      }) => ({
        number: legislation.number,
        congress: legislation.congress,
        title: legislation.title,
        latestAction: legislation.latestAction?.text,
        latestActionDate: legislation.latestAction?.actionDate,
        policyArea: legislation.policyArea?.name,
        type: legislation.type,
        url: legislation.url,
        sponsorId: officials[i]?.id,
      })
    );

    const creation = await prisma.sponsoredLegislation.createMany({
      data: formattedLegislation,
    });

    console.log("creation:", creation);
  }
};

doBackfill();

const doCleanUp = async () => {
  const sponsoredLegislation = await prisma.sponsoredLegislation.findMany();
  for (let i = 0; i < sponsoredLegislation.length; i++) {
    if (sponsoredLegislation[i]?.title === null) {
      await prisma.sponsoredLegislation.delete({
        where: {
          id: sponsoredLegislation[i]?.id,
        },
      });
    }
  }
};

doCleanUp();
