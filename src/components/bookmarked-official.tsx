import { Representative, Senator } from "@prisma/client";
import React from "react";
import { useRouter } from "next/router";

type BookmarkedOfficialProps = {
  profile: Senator | Representative;
};

const BookmarkedOfficial: React.FC<BookmarkedOfficialProps> = ({ profile }) => {
  const router = useRouter();
  return (
    <div key={profile.id} className="mt-4 flex items-center justify-between">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="h-10 transform cursor-pointer rounded-md border object-contain p-[2px] transition duration-200 ease-out hover:scale-110"
        src={`https://theunitedstates.io/images/congress/225x275/${profile.bioguideId}.jpg`}
        alt="Logo"
      />
      <div className="ml-4 flex-1">
        <h2 className="text-sm font-semibold">{profile.firstName}</h2>
        <h3 className="text-xs text-gray-400">Party: {profile.party}</h3>
      </div>
      <button
        className="text-xs font-bold text-blue-400"
        onClick={() => router.push(`/senator/${profile.bioguideId}`)}
      >
        View
      </button>
    </div>
  );
};

export default BookmarkedOfficial;
