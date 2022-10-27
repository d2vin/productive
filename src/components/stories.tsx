import React, { useState } from "react";
import { trpc } from "../utils/trpc";
import Story from "./story";

type StoriesProps = {
  message: string;
};

const Stories: React.FC<StoriesProps> = ({ message }) => {
  // const { data: session } = useSession();
  const [list, setList] = useState<boolean>(true);
  const senators = trpc.example.getSenators.useQuery();
  const representatives = trpc.example.getRepresentatives.useQuery();

  return (
    <>
      <div className="mt-8 flex-col justify-center space-y-10 overflow-x-scroll rounded-sm border border-gray-200 bg-white p-6 align-middle scrollbar-thin scrollbar-thumb-black">
        <div className="absolute flex max-w-xl space-x-2">
          <div className="flex flex-1 justify-center">
            <button
              onClick={(event) => {
                event.preventDefault();
                setList(true);
              }}
              className={`rounded-md border border-gray-300 px-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-400 ${
                list ? `bg-gray-400` : `bg-white`
              }`}
            >
              Senators
            </button>
          </div>
          <div className="flex flex-1 justify-center">
            <button
              onClick={(event) => {
                event.preventDefault();
                setList(false);
              }}
              className={`rounded-md border border-gray-300 px-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-400 ${
                !list ? `bg-gray-400` : `bg-white`
              }`}
            >
              Representatives
            </button>
          </div>
        </div>
        <div className="flex space-x-2">
          {/* Story */}
          {/* {session && (
          <Story
            image={
              typeof session?.user?.image === 'string'
                ? session?.user?.image
                : '/productive.png'
            }
            username={
              typeof session?.user?.name === 'string'
                ? session?.user?.name
                : '/productive.png'
            }
          />
        )} */}

          {list &&
            senators.data
              // .slice(0, 20)
              ?.map((profile: { id: string; firstName: string }) => {
                return (
                  <Story
                    key={profile.id}
                    image={`https://theunitedstates.io/images/congress/225x275/${profile.id}.jpg`}
                    username={profile.firstName}
                    id={profile.id}
                    list={list}
                  />
                );
              })}
          {!list &&
            representatives.data
              // .slice(0, 20)
              ?.map((profile: { id: string; firstName: string }) => {
                return (
                  <Story
                    key={profile.id}
                    image={`https://theunitedstates.io/images/congress/225x275/${profile.id}.jpg`}
                    username={profile.firstName}
                    id={profile.id}
                    list={list}
                  />
                );
              })}
        </div>
      </div>
    </>
  );
};

export default Stories;
