import React from "react";
import Image from "next/image";

type ElectionProps = {
  id: string;
  cycle: string;
  branch: string;
  district: string;
  candidateA: string;
  canidateB: string;
};

const Election: React.FC<ElectionProps> = ({
  cycle,
  branch,
  district,
  candidateA,
  canidateB,
}) => {
  return (
    <>
      <div className="my-7 max-w-2xl space-y-2 rounded-lg border bg-white p-4 sm:max-w-6xl">
        <div className="flex justify-between">
          <div className="flex flex-1 flex-row space-x-2">
            <div className="flex">
              <Image
                src="/democrat.png"
                height={48}
                width={48}
                alt="Candidate"
              />
            </div>
            <div className="text-xs">
              <h1>{candidateA}</h1>
              <p>Class: {district.slice(4, 5)}</p>
            </div>
          </div>
          <div className="flex flex-1 justify-center">
            <p>
              <strong>{district.slice(0, 2)}</strong>
            </p>
          </div>
          <div className="flex flex-1 flex-row justify-end space-x-2">
            <div className="text-xs">
              <h1 className="flex justify-end">{canidateB}</h1>
              <p className="flex justify-end">Class: {district.slice(4, 5)}</p>
            </div>
            <div className="flex">
              <Image
                src="/republican.png"
                height={32}
                width={48}
                alt="Candidate"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Election;
