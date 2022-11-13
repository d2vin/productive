import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { trpc } from "../utils/trpc";
import Legislation from "./legislation";
import Image from "next/image";

const SenatorLegislation: React.FC = () => {
  const [loading, setLoading] = useState<boolean>();
  const senatorLegislation =
    trpc.legislation.infiniteSenatorLegislation.useInfiniteQuery(
      {
        limit: 4,
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getNextPageParam(lastPage: any) {
          return lastPage.nextCursor;
        },
      }
    );

  const [ref, inView, entry] = useInView();

  useEffect(() => {
    if (inView) senatorLegislation.fetchNextPage();
  }, [inView, senatorLegislation, loading]);

  return (
    <>
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        senatorLegislation.data?.pages.map((page: { items: any[] }) =>
          page?.items
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ?.map((legislation: any, k: number) => {
              if (page?.items?.length === k + 1) {
                return (
                  <div key={k} ref={ref}>
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
                    />
                    {senatorLegislation.isFetching && (
                      <div className="mb-7 flex w-full justify-center">
                        <Image
                          src="/grid.svg"
                          height={32}
                          width={32}
                          alt="Loader"
                        />
                      </div>
                    )}
                  </div>
                );
              }
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
                  />
                </div>
              );
            })
        )
      }
    </>
  );
};

export default SenatorLegislation;
