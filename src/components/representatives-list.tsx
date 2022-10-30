import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";

type RepresentativesListProps = {
  id: string;
  firstName: string;
  lastName: string;
  party: string;
};

const RepresentativesList: React.FC<RepresentativesListProps> = ({
  id,
  firstName,
  party,
  lastName,
}) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const router = useRouter();
  const { data: session } = useSession();
  const bookmarkMutation =
    trpc.representative.bookmarkRepresentative.useMutation();
  const unbookmarkMutation =
    trpc.representative.unbookmarkRepresentative.useMutation();
  const { data, status } =
    trpc.representative.isBookmarkedRepresentative.useQuery({
      representativeId: id,
    });

  const bookmarkRepresentative = async () => {
    const userId = session?.user?.id;
    console.log(userId, id);
    console.log("bookmarking representative");
    await bookmarkMutation.mutate({
      representativeId: id,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      userId: userId!,
    });
    setIsBookmarked(true);
  };

  const unbookmarkRepresentative = async () => {
    const userId = session?.user?.id;
    console.log("Unbookmarking representative");
    await unbookmarkMutation.mutate({
      representativeId: id,
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
        onClick={() => router.push(`/representative/${id}`)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="h-10 w-10 transform cursor-pointer rounded-full border object-contain p-[2px] transition duration-200 ease-out hover:scale-110"
          src={`https://theunitedstates.io/images/congress/225x275/${id}.jpg`}
          alt="Logo"
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
            isBookmarked
              ? () => unbookmarkRepresentative()
              : () => bookmarkRepresentative()
          }
        >
          {status === "loading" ? (
            <p className="animate-pulse text-gray-400">...</p>
          ) : isBookmarked ? (
            "Unbookmark"
          ) : (
            "Bookmark"
          )}
        </button>
      </div>
    </>
  );
};

export default RepresentativesList;
