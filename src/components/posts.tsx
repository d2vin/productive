import React from "react";
import { trpc } from "../utils/trpc";
// import { trpc } from '../utils/trpc';
import Vote from "./vote";

type PostsProps = {
  message: string;
};

const postsList = [
  {
    bill: {
      title:
        "To amend the Justice for United States Victims of State Sponsored Terrorism Act to authorize appropriations for catch-up payments from the United States Victims of State Sponsored Terrorism Fund.",
      latest_action:
        "Motion to reconsider laid on the table Agreed to without objection.",
    },
    description: "Fairness for 9/11 Families Act",
    vote_type: "YEA-AND-NAY",
    date: "2022-09-30",
    time: "13:19:00",
    result: "Passed",
    democratic: {
      yes: 219,
      no: 1,
      present: 0,
      not_voting: 1,
      majority_position: "Yes",
    },
    republican: {
      yes: 181,
      no: 30,
      present: 0,
      not_voting: 1,
      majority_position: "Yes",
    },
    independent: {
      yes: 0,
      no: 0,
      present: 0,
      not_voting: 0,
    },
    total: {
      yes: 400,
      no: 31,
      present: 0,
      not_voting: 2,
    },
  },
];

const Posts: React.FC<PostsProps> = ({ message }) => {
  const { data, status } = trpc.example.getVotes.useQuery();
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {data
        .slice(0, 20)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((vote: any, k: React.Key | null | undefined) => {
          return (
            <div key={k}>
              <Vote
                title={`${vote.title}`}
                latestAction={`${vote.latestAction}`}
                description={`${vote.description}`}
                result={`${vote.result}`}
                demProgress={
                  Math.round(
                    (vote.demProgress.yes /
                      (vote.demProgress.yes + vote.demProgress.no)) *
                      100 *
                      10
                  ) / 10
                }
                repProgress={
                  Math.round(
                    (vote.repProgress.yes /
                      (vote.repProgress.yes + vote.repProgress.no)) *
                      100 *
                      10
                  ) / 10
                }
                indProgress={
                  Math.round(
                    (vote.indProgress.yes /
                      (vote.indProgress.yes + vote.indProgress.no)) *
                      100 *
                      10
                  ) / 10
                }
                totalProgress={
                  Math.round(
                    (vote.totalProgress.yes /
                      (vote.totalProgress.yes + vote.totalProgress.no)) *
                      100 *
                      10
                  ) / 10
                }
                date={vote.date}
                rollCall={vote.rollCall}
                voteId={vote.id}
              />
            </div>
          );
        })}
    </div>
  );
};

export default Posts;
