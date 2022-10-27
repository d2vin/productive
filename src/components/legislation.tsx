import {
  CakeIcon,
  DotsHorizontalIcon,
  BookmarkIcon,
} from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";

type LegislationProps = {
  congress: number;
  introducedDate: string;
  latestAction?: string;
  number: number;
  policyArea: string;
  title: string;
  url: string;
};

const Legislation: React.FC<LegislationProps> = ({
  congress,
  introducedDate,
  latestAction,
  number,
  policyArea,
  title,
  url,
}) => {
  const [party, setParty] = useState<string>("");
  const [voteResult, setVoteResult] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const { data: session } = useSession();
  const saveMutation = trpc.example.saveVote.useMutation();
  const unsaveMutation = trpc.example.unsaveVote.useMutation();
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
            {introducedDate}
          </span>
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
                          // onClick={() => unsaveVote()}
                        >
                          {" "}
                          <BookmarkIcon
                            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white"
                            aria-hidden="true"
                          />{" "}
                          <span>Unsave Legislation</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="group flex w-full items-center px-4 py-2 text-sm text-gray-600 hover:text-white"
                          // onClick={() => saveLegislation()}
                        >
                          {" "}
                          <BookmarkIcon
                            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white"
                            aria-hidden="true"
                          />{" "}
                          <span>Save Legislation</span>
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      className="group flex w-full items-center px-4 py-2 text-sm text-gray-600 hover:text-white"
                      // onClick={() => saveVote()}
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
      <h2 className="text-gray-400">{policyArea}</h2>
      <h2>{latestAction}</h2>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* <img
        src="https://source.unsplash.com/random"
        alt="Logo"
        className="h-96 w-full object-cover"
      /> */}
    </div>
  );
};

export default Legislation;
