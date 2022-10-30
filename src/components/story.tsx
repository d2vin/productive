import { useRouter } from "next/router";
import React from "react";

type StoryProps = {
  image: string;
  firstName: string;
  id: string;
  list: boolean;
  lastName: string;
};

const Story: React.FC<StoryProps> = ({
  image,
  firstName,
  lastName,
  id,
  list,
}) => {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col items-center space-y-2">
        <div className="flex transform cursor-pointer items-center justify-center rounded-md border-2 object-contain p-[2px] transition duration-200 ease-out hover:scale-110">
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
              className="h-12 transform cursor-pointer rounded-md object-contain p-[2px] transition duration-200 ease-out hover:scale-110"
              src={image}
              alt="Profile"
            />
          </button>
        </div>
        <p className="w-14 truncate text-center text-xs">{firstName}</p>
        <p className="relative bottom-2 w-14 truncate text-center text-xs">
          {lastName}
        </p>
      </div>
    </>
  );
};

export default Story;
