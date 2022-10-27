import React, { useState } from "react";
import { trpc } from "../utils/trpc";
import RepresentativesList from "./representatives-list";
import SenatorsList from "./senators-list";

type OfficialsListProps = {
  message: string;
};

const OfficialsList: React.FC<OfficialsListProps> = ({ message }) => {
  const [list, setList] = useState<boolean>(true);
  const senators = trpc.example.getSenators.useQuery();
  const representatives = trpc.example.getRepresentatives.useQuery();

  return (
    <>
      <div className="my-7 rounded-lg border bg-white">
        <div className="flex">
          <div
            onClick={(event) => {
              event.preventDefault();
              setList(true);
            }}
            className="flex flex-1 cursor-pointer items-center justify-center p-4 hover:bg-gray-200"
          >
            {message}
            {list && <div className="absolute mt-12 h-2 w-24 bg-indigo-400" />}
          </div>
          <div
            onClick={(event) => {
              event.preventDefault();
              setList(false);
            }}
            className="flex flex-1 cursor-pointer items-center justify-center hover:bg-gray-200"
          >
            Representatives
            {!list && <div className="absolute mt-12 h-2 w-24 bg-indigo-400" />}
          </div>
        </div>
        {list &&
          senators.data
            ?.slice(0, 20)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((senator: any, k) => (
              <SenatorsList
                key={k}
                id={senator.id}
                firstName={senator.firstName}
                party={senator.party}
                lastName={senator.lastName}
              />
            ))}
        {!list &&
          representatives.data
            ?.slice(0, 20)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((representative: any, k) => (
              <RepresentativesList
                key={k}
                id={representative.id}
                firstName={representative.firstName}
                party={representative.party}
                lastName={representative.lastName}
              />
            ))}
      </div>
    </>
  );
};

export default OfficialsList;
