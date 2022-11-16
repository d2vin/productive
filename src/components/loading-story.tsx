import React from "react";

const LoadingStory: React.FC = () => {
  return (
    <>
      <div className="flex flex-col items-center space-y-2 pb-4">
        <div className="flex transform cursor-pointer items-center justify-center rounded-md border-2 object-contain p-[2px] transition duration-200 ease-out hover:scale-110">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="h-12 w-10 transform animate-pulse cursor-pointer rounded-md border-2 border-white bg-gray-300 object-contain p-[2px] transition duration-200 ease-out hover:scale-110"></div>
        </div>
        <p className="w-14 truncate text-center text-xs animate-pulse">...</p>
        <p className="relative bottom-2 w-14 truncate text-center text-xs"></p>
      </div>
    </>
  );
};

export default LoadingStory;
