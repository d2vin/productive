import React from "react";
import { trpc } from "../utils/trpc";

type SuggestionsProps = {
  message: string;
};

const suggestions = [
  {
    id: "B001230",
    title: "Senator, 1st Class",
    short_title: "Sen.",
    api_uri: "https://api.propublica.org/congress/v1/members/B001230.json",
    first_name: "Tammy",
    middle_name: null,
    last_name: "Baldwin",
    suffix: null,
    date_of_birth: "1962-02-11",
    gender: "F",
    party: "D",
    leadership_role: "Senate Democratic Caucus Secretary",
    twitter_account: "SenatorBaldwin",
    facebook_account: "senatortammybaldwin",
    youtube_account: "witammybaldwin",
    govtrack_id: "400013",
    cspan_id: "57884",
    votesmart_id: "3470",
    icpsr_id: "29940",
    crp_id: "N00004367",
    google_entity_id: "/m/024v02",
    fec_candidate_id: "H8WI00018",
    url: "https://www.baldwin.senate.gov",
    rss_url: null,
    contact_form: "https://www.baldwin.senate.gov/feedback",
    in_office: true,
    cook_pvi: null,
    dw_nominate: -0.493,
    ideal_point: null,
    seniority: "9",
    next_election: "2024",
    total_votes: 866,
    missed_votes: 1,
    total_present: 0,
    last_updated: "2022-10-01 01:45:44 -0400",
    ocd_id: "ocd-division/country:us/state:wi",
    office: "709 Hart Senate Office Building",
    phone: "202-224-5653",
    fax: null,
    state: "WI",
    senate_class: "1",
    state_rank: "junior",
    lis_id: "S354",
    missed_votes_pct: 0.12,
    votes_with_party_pct: 98.96,
    votes_against_party_pct: 1.04,
  },
];

const Suggestions: React.FC<SuggestionsProps> = ({ message }) => {
  const { data, status } = trpc.example.getSenators.useQuery();
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>Loading...</p>;
  }
  console.log(data.results);
  return (
    <div className="mt-4 ml-10">
      <div className="mb-5 flex justify-between space-x-8 text-sm">
        <h3 className="text-sm font-bold text-gray-400">{message}</h3>
        <button className="font-semibold text-gray-600">See All</button>
      </div>
      {data.results[0].members
        .slice(0, 5)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((profile: any) => (
          <div
            key={profile.id}
            className="mt-3 flex items-center justify-between"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-10 w-10 transform cursor-pointer rounded-full border object-contain p-[2px] transition duration-200 ease-out hover:scale-110"
              src={`https://theunitedstates.io/images/congress/225x275/${profile.id}.jpg`}
              alt="Logo"
            />
            <div className="ml-4 flex-1">
              <h2 className="text-sm font-semibold">{profile.first_name}</h2>
              <h3 className="text-xs text-gray-400">Party: {profile.party}</h3>
            </div>
            <button className="text-xs font-bold text-blue-400">View</button>
          </div>
        ))}
    </div>
  );
};

export default Suggestions;
