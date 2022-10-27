import { useRouter } from "next/router";
import React from "react";

type StoryProps = {
  image: string;
  username: string;
  id: string;
  list: boolean;
};

const Story: React.FC<StoryProps> = ({ image, username, id, list }) => {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col items-center space-y-2">
        <div className="flex transform cursor-pointer items-center justify-center rounded-full border-2 border-red-500 object-contain p-[2px] transition duration-200 ease-out hover:scale-110">
          <button
            onClick={(event) => {
              event.preventDefault();
              list
                ? router.push(`/senator/${id}`)
                : router.push(`/representative/${id}`);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-12 w-12 transform cursor-pointer rounded-full border object-contain p-[2px] transition duration-200 ease-out hover:scale-110"
              src={image}
              alt="Logo"
            />
          </button>
        </div>
        <p className="w-14 truncate text-center text-xs">{username}</p>
      </div>
    </>
  );
};

export default Story;
