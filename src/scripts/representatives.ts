import { PrismaClient } from "@prisma/client";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const prisma = new PrismaClient();
const doBackfill = async () => {
  const res = await axios.get(
    "https://api.propublica.org/congress/v1/117/house/members.json",
    {
      headers: {
        "X-API-Key": "UfkwGLR7qYlW4i0fKxiLJ3kxIFnPp1lJolHy8hw8",
      },
    }
  );
  const allRepresentatives = res.data.results[0].members;
  const formattedRepresentatives = (await allRepresentatives).map(
    (representative: {
      id: string;
      title: string;
      short_title: string;
      api_uri: string;
      first_name: string;
      last_name: string;
      party: string;
      twitter_account: string;
      facebook_account: string;
      youtube_account: string;
      url: string;
      contact_form: string;
      in_office: boolean;
      next_election: string;
      total_votes: number;
      missed_votes: number;
      state: string;
      district: string;
      votes_with_party_pct: number;
      votes_against_party_pct: number;
    }) => ({
      id: representative.id,
      title: representative.title,
      shortTitle: representative.short_title,
      apiUri: representative.api_uri,
      firstName: representative.first_name,
      lastName: representative.last_name,
      party: representative.party,
      twitterAccount: representative.twitter_account,
      facebookAccount: representative.facebook_account,
      youtubeAccount: representative.youtube_account,
      url: representative.url,
      contactForm: representative.contact_form,
      inOffice: representative.in_office,
      nextElection: representative.next_election,
      totalVotes: representative.total_votes,
      missedVotes: representative.missed_votes,
      state: representative.state,
      district: representative.district,
      votesWithPartyPct: representative.votes_with_party_pct,
      votesAgainstPartyPct: representative.votes_against_party_pct,
    })
  );

  const creation = await prisma.representative.createMany({
    data: formattedRepresentatives,
  });

  console.log("creation:", creation);
};

doBackfill();
