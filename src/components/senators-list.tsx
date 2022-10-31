import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";

type SenatorsListProps = {
  id: string;
  firstName: string;
  lastName: string;
  party: string;
};

const SenatorsList: React.FC<SenatorsListProps> = ({
  id,
  firstName,
  party,
  lastName,
}) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const router = useRouter();
  const { data: session } = useSession();
  const bookmarkMutation = trpc.senator.bookmarkSenator.useMutation();
  const unbookmarkMutation = trpc.senator.unbookmarkSenator.useMutation();
  const { data, status } = trpc.senator.isBookmarkedSenator.useQuery({
    senatorId: id,
  });

  const bookmarkSenator = async () => {
    const userId = session?.user?.id;
    console.log(userId, id);
    console.log("bookmarking senator");
    await bookmarkMutation.mutate({
      senatorId: id,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      userId: userId!,
    });
    setIsBookmarked(true);
  };

  const unbookmarkSenator = async () => {
    const userId = session?.user?.id;
    console.log("Unbookmarking senator");
    await unbookmarkMutation.mutate({
      senatorId: id,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      userId: userId!,
    });
    setIsBookmarked(false);
  };

  useEffect(() => {
    if (data) setIsBookmarked(true);
  }, [data]);

  return (
    <>
      <div
        key={id}
        className="flex items-center justify-between p-4 hover:bg-gray-200"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="h-10 transform cursor-pointer rounded-md border object-contain p-[2px] transition duration-200 ease-out hover:scale-110"
          src={`https://theunitedstates.io/images/congress/225x275/${id}.jpg`}
          alt="Logo"
          onClick={() => router.push(`/senator/${id}`)}
        />
        <div className="ml-4 flex-1">
          <h2 className="text-sm font-semibold">
            {firstName} {lastName}
          </h2>
          <h3 className="text-xs text-gray-400">Party: {party}</h3>
        </div>
        <button
          className="text-xs font-bold text-blue-400"
          onClick={
            session
              ? isBookmarked
                ? () => unbookmarkSenator()
                : () => bookmarkSenator()
              : () => signIn()
          }
        >
          {status === "loading" ? (
            <p className="animate-pulse text-gray-400">...</p>
          ) : session ? (
            isBookmarked ? (
              "Unbookmark"
            ) : (
              "Bookmark"
            )
          ) : (
            "Sign In"
          )}
        </button>
      </div>
    </>
  );
};

export default SenatorsList;
