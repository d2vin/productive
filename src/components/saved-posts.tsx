import React from "react";
import { trpc } from "../utils/trpc";
// import { trpc } from '../utils/trpc';
import Vote from "./vote";

type SavedPostsProps = {
  message: string;
};

const SavedPosts: React.FC<SavedPostsProps> = ({}) => {
  const { data, status } = trpc.example.getSavedVotes.useQuery();
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

export default SavedPosts;
