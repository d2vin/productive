import React from "react";
import { trpc } from "../utils/trpc";
import Legislation from "../components/legislation";

type SponsoredProps = {
  id: string;
};

const Sponsored: React.FC<SponsoredProps> = ({ id }) => {
  const { data } = trpc.legislation.getSponsoredLegislation.useQuery({
    id: id,
  });

  return (
    <div>
      <h1 className="mt-10 text-center text-4xl font-semibold sm:text-left">
        Sponsored Legislation
      </h1>
      {data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ?.map((legislation: any, k: React.Key | null | undefined) => {
          return (
            <div key={k}>
              <Legislation
                id={legislation.id}
                congress={legislation.congress}
                latestActionDate={legislation.latestActionDate}
                latestAction={legislation.latestAction}
                number={legislation.number}
                policyArea={legislation.policyArea}
                title={legislation.title}
                url={legislation.url}
                sponsor={legislation.sponsor}
                sponsorMemberType={legislation.sponsorMemberType}
                sponsorId={legislation.sponsorId}
              />
            </div>
          );
        })}
    </div>
  );
};

export default Sponsored;
