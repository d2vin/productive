import React from "react";
import { trpc } from "../utils/trpc";
// import { trpc } from '../utils/trpc';
import Legislation from "../components/legislation";
type SponsoredProps = {
  id: string;
};

const Sponsored: React.FC<SponsoredProps> = ({ id }) => {
  const { data } = trpc.example.getSponsoredLegislation.useQuery({
    id: id,
  });

  return (
    <div>
      <h1 className="mt-10 text-center text-4xl font-semibold sm:text-left">
        Sponsored Legislation
      </h1>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {data?.sponsoredLegislation
        .slice(0, 10)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((legislation: any, k: React.Key | null | undefined) => {
          return (
            <div key={k}>
              <Legislation
                congress={legislation.congress}
                introducedDate={legislation.introducedDate}
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                latestAction={legislation.latestAction.text}
                number={legislation.number}
                policyArea={legislation.policyArea.name}
                title={legislation.title}
                url={legislation.url}
              />
            </div>
          );
        })}
    </div>
  );
};

export default Sponsored;
