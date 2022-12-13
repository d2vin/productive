import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();
const doBackfill = async () => {
  const res = await axios.get(
    "https://api.propublica.org/congress/v1/117/senate/members.json",
    {
      headers: {
        "X-API-Key": process.env.PROPUBLICA_API_KEY as string,
      },
    }
  );
  const allSenators = res.data.results[0].members;
  const formattedSenators = (await allSenators).map(
    (senator: {
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
      senate_class: string;
      state_rank: string;
      votes_with_party_pct: number;
      votes_against_party_pct: number;
    }) => ({
      bioguideId: senator.id,
      title: senator.title,
      shortTitle: senator.short_title,
      apiUri: senator.api_uri,
      firstName: senator.first_name,
      lastName: senator.last_name,
      party: senator.party,
      twitterAccount: senator.twitter_account,
      facebookAccount: senator.facebook_account,
      youtubeAccount: senator.youtube_account,
      url: senator.url,
      contactForm: senator.contact_form,
      inOffice: senator.in_office,
      nextElection: senator.next_election,
      totalVotes: senator.total_votes,
      missedVotes: senator.missed_votes,
      state: senator.state,
      senateClass: senator.senate_class,
      stateRank: senator.state_rank,
      votesWithPartyPct: senator.votes_with_party_pct,
      votesAgainstPartyPct: senator.votes_against_party_pct,
    })
  );

  const creation = await prisma.senator.createMany({
    data: formattedSenators,
  });

  console.log("creation:", creation);
};

doBackfill();
