import React from 'react';

type StoryProps = {
  image: string;
  username: string;
};

const Story: React.FC<StoryProps> = ({ image, username }) => {
  return (
    <>
      <div className="flex flex-col items-center space-y-2">
        <div className="flex justify-center items-center rounded-full p-[2px] border-red-500 border-2 object-contain cursor-pointer hover:scale-110 transition transform duration-200 ease-out">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="h-12 w-12 rounded-full p-[2px] border object-contain cursor-pointer hover:scale-110 transition transform duration-200 ease-out"
            src={image}
            alt="Logo"
          />
        </div>
        <p className="text-xs w-14 truncate text-center">{username}</p>
      </div>
    </>
  );
};

export default Story;
