import React, { useEffect } from "react";
import { trpc } from "../utils/trpc";
import Legislation from "./legislation";

const RepresentativeLegislation: React.FC = () => {
  const RepresentativesLegislation =
    trpc.legislation.infiniteRepresentativeLegislation.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getNextPageParam(lastPage: any) {
          return lastPage.nextCursor;
        },
      }
    );

  const fetchMore = () => RepresentativesLegislation.fetchNextPage();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onScroll = (event: any) => {
      const { scrollHeight, scrollTop, clientHeight } =
        event.target.scrollingElement;
      if (scrollHeight - scrollTop <= clientHeight * 1) {
        console.log("hi");
        fetchMore();
      }
    };
    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  });

  return (
    <div>
      {RepresentativesLegislation.data?.pages.map((page: { items: any[] }) =>
        page?.items
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ?.map((legislation: any, k: React.Key | null | undefined) => {
            return (
              <div key={k}>
                <Legislation
                  congress={legislation.congress}
                  latestActionDate={legislation.latestActionDate}
                  latestAction={legislation.latestAction}
                  number={legislation.number}
                  policyArea={legislation.policyArea}
                  title={legislation.title}
                  url={legislation.url}
                  sponsor={legislation.sponsor}
                />
              </div>
            );
          })
      )}
    </div>
  );
};

export default RepresentativeLegislation;
