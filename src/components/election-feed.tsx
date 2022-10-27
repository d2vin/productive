import { useSession } from "next-auth/react";
import React from "react";
import { trpc } from "../utils/trpc";
import Election from "./election";
import MiniProfile from "./mini-profile";
import Suggestions from "./suggestions";

type ElectionFeedProps = {
  message: string;
};

const ElectionFeed: React.FC<ElectionFeedProps> = ({ message }) => {
  const { data: session } = useSession();
  const { data, status } = trpc.example.getSenateElections.useQuery();

  return (
    <>
      <main
        className={`mx-auto grid grid-cols-1 md:max-w-3xl md:grid-cols-2 xl:max-w-6xl xl:grid-cols-3 ${
          !session && "!max-w-3xl !grid-cols-1"
        }`}
      >
        {/* Section */}
        <section className="col-span-2">
          <h1 className="mt-20 text-center text-4xl font-semibold sm:text-left">
            {message}
          </h1>
          {/* Elections */}
          <div>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data
              ?.slice(0, 34)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((election: any, k: React.Key | null | undefined) => {
                return (
                  <div key={k}>
                    <Election
                      cycle={election.cycle}
                      id={election.id}
                      branch={election.branch}
                      district={election.district}
                      candidateA={election.candidateA}
                      canidateB={election.candidateB}
                    />
                  </div>
                );
              })}
          </div>
        </section>
        {/* Section */}
        {session && (
          <section className="hidden md:col-span-1 xl:inline-grid">
            <div className="fixed top-20">
              {/* Mini Profile */}
              <MiniProfile message={"Mini Profile"} />
              {/* Suggestions */}
              <Suggestions message={"Bookmarked Officials "} />
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default ElectionFeed;
