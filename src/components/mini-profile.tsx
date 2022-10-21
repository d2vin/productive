import React from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

type MiniProfileProps = {
  message: string;
};

const MiniProfile: React.FC<MiniProfileProps> = ({ message }) => {
  const { data: session } = useSession();
  // console.log(session);
  return (
    <div className="mt-14 ml-10 flex items-center justify-between">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <Image
        src={
          typeof session?.user?.image === "string"
            ? session?.user?.image
            : "/productive.png"
        }
        height="36"
        width="36"
        alt="Profile"
        className="h-16 w-16 rounded-full border p-[2px]"
        // className="h-10 rounded-full cursor-pointer"
      />
      <div className="mx-4 flex-1">
        <h2 className="font-bold">{session?.user?.name}</h2>
        {/* <h3 className="text-sm text-gray-400">{message}</h3> */}
      </div>
      <button
        onClick={() => signOut()}
        className="text-sm font-semibold text-blue-400"
      >
        Sign out
      </button>
    </div>
  );
};

export default MiniProfile;
