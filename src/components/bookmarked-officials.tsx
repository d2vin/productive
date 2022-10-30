import React, { useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

type BookmarkedOfficialsProps = {
  message: string;
};

const BookmarkedOfficials: React.FC<BookmarkedOfficialsProps> = ({
  message,
}) => {
  const [list, setList] = useState(true);
  const router = useRouter();
  const senators = trpc.senator.getBookmarkedSenators.useQuery();
  const representatives =
    trpc.representative.getBookmarkedRepresentatives.useQuery();

  return (
    <div className="mt-4 ml-10">
      <div className="mb-5 flex justify-between space-x-8 text-sm">
        <h3 className="text-sm font-bold text-gray-400">{message}</h3>
        <button
          className="rounded-md border border-gray-400 px-1 font-semibold text-gray-600 hover:bg-gray-400"
          onClick={() => setList(!list)}
        >
          {list ? "Sen" : "Rep"}
        </button>
      </div>
      {list
        ? senators.data
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ?.map((profile: any) => (
              <div
                key={profile.id}
                className="mt-3 flex items-center justify-between"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-10 transform cursor-pointer rounded-md border object-contain p-[2px] transition duration-200 ease-out hover:scale-110"
                  src={`https://theunitedstates.io/images/congress/225x275/${profile.id}.jpg`}
                  alt="Logo"
                />
                <div className="ml-4 flex-1">
                  <h2 className="text-sm font-semibold">{profile.firstName}</h2>
                  <h3 className="text-xs text-gray-400">
                    Party: {profile.party}
                  </h3>
                </div>
                <button
                  className="text-xs font-bold text-blue-400"
                  onClick={() => router.push(`/senator/${profile.id}`)}
                >
                  View
                </button>
              </div>
            ))
        : representatives.data
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ?.map((profile: any) => (
              <div
                key={profile.id}
                className="mt-3 flex items-center justify-between"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-10 transform cursor-pointer rounded-md border object-contain p-[2px] transition duration-200 ease-out hover:scale-110"
                  src={`https://theunitedstates.io/images/congress/225x275/${profile.id}.jpg`}
                  alt="Logo"
                />
                <div className="ml-4 flex-1">
                  <h2 className="text-sm font-semibold">{profile.firstName}</h2>
                  <h3 className="text-xs text-gray-400">
                    Party: {profile.party}
                  </h3>
                </div>
                <button
                  className="text-xs font-bold text-blue-400"
                  onClick={() => router.push(`/senator/${profile.id}`)}
                >
                  View
                </button>
              </div>
            ))}
    </div>
  );
};

export default BookmarkedOfficials;
