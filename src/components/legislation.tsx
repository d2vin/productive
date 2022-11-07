import { DotsHorizontalIcon, BookmarkIcon } from "@heroicons/react/solid";
import { Data } from "@react-google-maps/api";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";

type LegislationProps = {
  id: number;
  congress: number;
  latestActionDate: string;
  latestAction?: string;
  number: number;
  policyArea: string;
  title: string;
  url: string;
  sponsor: string;
};

const Legislation: React.FC<LegislationProps> = ({
  id,
  latestActionDate,
  latestAction,
  policyArea,
  title,
  sponsor,
}) => {
  const { data: session } = useSession();
  const [voteFor, setVoteFor] = useState<boolean>(false);
  const [voteAgainst, setVoteAgainst] = useState<boolean>(false);
  const { data, status } = trpc.legislation.getVoteForLegislation.useQuery({
    sponsoredLegislationId: id,
  });
  const voteMutation = trpc.legislation.voteForLegislation.useMutation();
  const unvoteMutation = trpc.legislation.unvoteForLegislation.useMutation();

  const vote = async (result: boolean) => {
    const userId = session?.user?.id;
    await voteMutation.mutate({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      userId: userId!,
      sponsoredLegislationId: id,
      result: result,
    });
  };

  const unvote = async () => {
    const userId = session?.user?.id;
    await unvoteMutation.mutate({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      userId: userId!,
      sponsoredLegislationId: id,
    });
  };

  useEffect(() => {
    if (data && status === "success") {
      setVoteFor(data.result);
      setVoteAgainst(!data.result);
    }
  }, [data, status]);

  return (
    <div className="my-7 max-w-2xl space-y-2 rounded-lg border bg-white p-4 sm:max-w-6xl">
      <div className="flex justify-between">
        <h1 className="space-x-2 font-bold">
          <span className="font-semibold">{title}</span>

          <span className="text-sm font-semibold text-gray-600">
            {latestActionDate}
          </span>
        </h1>
      </div>
      <h2 className="text-gray-400">Policy Area: {policyArea}</h2>
      <h2>Latest Action: {latestAction}</h2>
      <h2>Sponsored by: {sponsor}</h2>
      {session ? (
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <button
            className={`w-full rounded-lg bg-slate-300 p-2 ${
              voteFor && "bg-green-500"
            }`}
            onClick={() => {
              if (!voteFor && !voteAgainst) {
                setVoteFor(true);
                vote(true);
              }
              if (voteFor) {
                setVoteFor(false);
                unvote();
              }
              if (voteAgainst) {
                setVoteFor(true);
                setVoteAgainst(false);
                unvote();
                vote(true);
              }
            }}
          >
            Vote For
          </button>
          <button
            className={`w-full rounded-lg bg-slate-300 p-2 ${
              voteAgainst && "bg-cyan-400"
            }`}
            onClick={() => {
              if (!voteFor && !voteAgainst) {
                vote(false);
              }
              if (voteAgainst) {
                setVoteAgainst(false);
                unvote();
              }
              if (voteFor) {
                setVoteAgainst(true);
                setVoteFor(false);
                unvote();
                vote(false);
              }
            }}
          >
            Vote Against
          </button>
        </div>
      ) : (
        <button onClick={() => signIn()}>Sign in to save your vote</button>
      )}
    </div>
  );
};

export default Legislation;
