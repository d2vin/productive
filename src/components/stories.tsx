import React from "react";
import { trpc } from "../utils/trpc";
import Story from "./story";

type StoriesProps = {
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

const Stories: React.FC<StoriesProps> = ({ message }) => {
  // const { data: session } = useSession();

  const { data, status } = trpc.example.getSenators.useQuery();
  console.log(data);
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="mt-8 flex space-x-2 overflow-x-scroll rounded-sm border border-gray-200 bg-white p-6 scrollbar-thin scrollbar-thumb-black">
        {/* Story */}
        {/* {session && (
          <Story
            image={
              typeof session?.user?.image === 'string'
                ? session?.user?.image
                : '/productive.png'
            }
            username={
              typeof session?.user?.name === 'string'
                ? session?.user?.name
                : '/productive.png'
            }
          />
        )} */}
        {data.results[0].members
          // .slice(0, 20)
          .map(
            (profile: {
              id: React.Key | null | undefined;
              first_name: string;
            }) => {
              return (
                <Story
                  key={profile.id}
                  image={`https://theunitedstates.io/images/congress/225x275/${profile.id}.jpg`}
                  username={profile.first_name}
                />
              );
            }
          )}
      </div>
    </>
  );
};

export default Stories;
