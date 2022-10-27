import {
  CakeIcon,
  DotsHorizontalIcon,
  BookmarkIcon,
} from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";

type VoteProps = {
  voteId: string;
  congress: number;
  chamber: string;
  rollCall: number;
  title: string;
  latestAction: string;
  description: string;
  result: string;
  demProgress: number;
  repProgress: number;
  indProgress: number;
  totalProgress: number;
  date: string;
};

const Vote: React.FC<VoteProps> = ({
  voteId,
  chamber,
  date,
  result,
  title,
  description,
  latestAction,
  demProgress,
  repProgress,
  indProgress,
  totalProgress,
}) => {
  const [party, setParty] = useState<string>("");
  const [voteResult, setVoteResult] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const { data: session } = useSession();
  const saveMutation = trpc.example.saveVote.useMutation();
  const unsaveMutation = trpc.example.unsaveVote.useMutation();
  const { data, status } = trpc.example.isSaved.useQuery({ voteId: voteId });

  const saveVote = async () => {
    const userId = session?.user?.id;
    console.log("Saving vote");
    await saveMutation.mutate({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      userId: userId!,
      voteId: voteId,
    });
    setIsSaved(true);
  };

  const unsaveVote = async () => {
    const userId = session?.user?.id;
    console.log("Unsaving vote");
    await unsaveMutation.mutate({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      userId: userId!,
      voteId: voteId,
    });
    setIsSaved(false);
  };

  useEffect(() => {
    result === "Passed" ? setVoteResult(true) : setVoteResult(false);
    if (data) setIsSaved(true);
  }, [result, data]);

  return (
    <div className="my-7 max-w-2xl space-y-2 rounded-lg border bg-white p-4 sm:max-w-6xl">
      <div className="flex justify-between">
        <h1 className="space-x-2 font-bold">
          <span className="font-semibold">{description}:</span>
          <span
            style={{ backgroundColor: `${voteResult ? "#4ade80" : "#f87171"}` }}
            className={`rounded-md p-[4px]`}
          >
            {result}
          </span>
          <span className="text-sm font-semibold text-gray-600">{date}</span>
        </h1>
        <div className="flex flex-col items-end">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex w-12 items-center justify-center rounded-md border border-gray-300 bg-white px-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-400"
          >
            <DotsHorizontalIcon className="h-5 flex-shrink-0 hover:cursor-pointer" />
          </button>
          {isOpen && (
            <div className="relative right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="rounded-md py-1 hover:bg-indigo-500">
                {session ? (
                  <>
                    {isSaved ? (
                      <>
                        <button
                          className="group flex w-full items-center px-4 py-2 text-sm text-gray-600 hover:text-white"
                          onClick={() => unsaveVote()}
                        >
                          {" "}
                          <BookmarkIcon
                            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white"
                            aria-hidden="true"
                          />{" "}
                          <span>Unsave Vote</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="group flex w-full items-center px-4 py-2 text-sm text-gray-600 hover:text-white"
                          onClick={() => saveVote()}
                        >
                          {" "}
                          <BookmarkIcon
                            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white"
                            aria-hidden="true"
                          />{" "}
                          <span>Save Vote</span>
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      className="group flex w-full items-center px-4 py-2 text-sm text-gray-600 hover:text-white"
                      onClick={() => saveVote()}
                    >
                      {" "}
                      <BookmarkIcon
                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white"
                        aria-hidden="true"
                      />{" "}
                      <span>Sign In</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <h2 className="text-gray-400">
        Chamber: {chamber.charAt(0).toUpperCase() + chamber.slice(1)}
      </h2>
      <h2>{title}</h2>
      <h2>{latestAction}</h2>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* <img
        src="https://source.unsplash.com/random"
        alt="Logo"
        className="h-96 w-full object-cover"
      /> */}
      <div className="xs:space-x-0 flex flex-col items-center justify-center space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        {indProgress > 0 && (
          <button
            className={`flex w-full flex-1 items-center justify-center space-x-2 rounded-md bg-slate-400 p-2 text-white hover:bg-slate-600`}
            onClick={() => setParty("Ind")}
          >
            <span className="font-semibold">Indpendent</span>
            <CakeIcon className="nav-btn" />
          </button>
        )}
        <button
          style={{
            backgroundColor: `${party === "Dem" ? "#2563eb" : "#60a5fa"}`,
          }}
          className={`flex w-full flex-1 items-center justify-center space-x-2 rounded-md p-2 text-white hover:bg-blue-600`}
          onClick={() => setParty("Dem")}
        >
          <span className="font-semibold">Democratic</span>
          <CakeIcon className="nav-btn" />
        </button>
        <button
          style={{
            backgroundColor: `${party === "Rep" ? "#dc2626" : "#f87171"}`,
          }}
          className={`flex w-full flex-1 items-center justify-center space-x-2 rounded-md bg-red-400 p-2 text-white hover:bg-red-600`}
          onClick={() => setParty("Rep")}
        >
          <span className="font-semibold">Republican</span>
          <CakeIcon className="nav-btn" />
        </button>
        <button
          style={{
            backgroundColor: `${party === "" ? "#525252" : "#a3a3a3"}`,
          }}
          className={`flex w-full flex-1 items-center justify-center space-x-2 rounded-md p-2 text-white hover:bg-neutral-600`}
          onClick={() => setParty("")}
        >
          <span className="font-semibold">Total Results</span>
          <CakeIcon className="nav-btn" />
        </button>
      </div>
      <div className="w-full rounded-md bg-gray-300">
        <div
          style={{
            width: `${
              party === "Dem"
                ? demProgress
                : party === "Rep"
                ? repProgress
                : party === "Ind"
                ? indProgress
                : totalProgress
            }%`,
          }}
          className={`flex h-full justify-center rounded-md p-2 transition-all duration-300 ${
            (party === "Dem"
              ? demProgress
              : party === "Rep"
              ? repProgress
              : party === "Ind"
              ? indProgress
              : totalProgress) <
            2 / 3
              ? "bg-red-400"
              : "bg-green-400"
          }`}
        >
          <span className="font-medium text-white">
            {(party === "Dem"
              ? demProgress
              : party === "Rep"
              ? repProgress
              : party === "Ind"
              ? indProgress
              : totalProgress
            ).toFixed(1) + "%"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Vote;
