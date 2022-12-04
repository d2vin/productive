import React, { useState } from "react";
import { trpc } from "../utils/trpc";
import BookmarkedOfficial from "./bookmarked-official";

type BookmarkedOfficialsProps = {
  message: string;
};

const BookmarkedOfficials: React.FC<BookmarkedOfficialsProps> = ({
  message,
}) => {
  const [list, setList] = useState(true);
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
      <div className="space-y-2">
        {list
          ? senators.data
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ?.map((profile: any) => (
                <div key={profile.id}>
                  <BookmarkedOfficial profile={profile} />
                </div>
              ))
          : representatives.data
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ?.map((profile: any) => (
                <div key={profile.id}>
                  <BookmarkedOfficial profile={profile} />
                </div>
              ))}
      </div>
    </div>
  );
};

export default BookmarkedOfficials;
