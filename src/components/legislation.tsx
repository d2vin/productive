import { DotsHorizontalIcon, BookmarkIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { trpc } from "../utils/trpc";

type LegislationProps = {
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
  congress,
  latestActionDate,
  latestAction,
  number,
  policyArea,
  title,
  url,
  sponsor,
}) => {
  const { data: session } = useSession();
  const saveMutation = trpc.vote.saveVote.useMutation();
  const unsaveMutation = trpc.vote.unsaveVote.useMutation();
  // const { data, status } = trpc.example.isSaved.useQuery({ voteId: voteId });

  // const saveVote = async () => {
  //   const userId = session?.user?.id;
  //   console.log("Saving vote");
  //   await saveMutation.mutate({
  //     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //     userId: userId!,
  //     voteId: voteId,
  //   });
  //   setIsSaved(true);
  // };

  // const unsaveVote = async () => {
  //   const userId = session?.user?.id;
  //   console.log("Unsaving vote");
  //   await unsaveMutation.mutate({
  //     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //     userId: userId!,
  //     voteId: voteId,
  //   });
  //   setIsSaved(false);
  // };

  // useEffect(() => {
  //   result === "Passed" ? setVoteResult(true) : setVoteResult(false);
  //   console.log(data);
  //   if (data) setIsSaved(true);
  // }, [result, data]);

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
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <button className="w-full rounded-lg bg-slate-300 px-2">
          Vote For
        </button>
        <button className="w-full rounded-lg bg-slate-300 px-2">
          Vote Against
        </button>
      </div>
    </div>
  );
};

export default Legislation;
