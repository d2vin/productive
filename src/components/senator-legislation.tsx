import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { trpc } from "../utils/trpc";
import Legislation from "./legislation";
import Image from "next/image";
import RadioGroupOptions from "./radio-group";

const SenatorLegislation: React.FC = () => {
  const plans = [
    { name: "All" },
    { name: "Agriculture and Food" },
    { name: "Animals" },
    { name: "Arts, Culture, Religion" },
    { name: "Civil Rights and Liberties, Minority Issues" },
    { name: "Commerce" },
    { name: "Congress" },
    { name: "Crime and Law Enforcement" },
    { name: "Economics and Public Finance" },
    { name: "Education" },
    { name: "Emergency Management" },
    { name: "Energy" },
    { name: "Environmental Protection" },
    { name: "Families" },
    { name: "Finance and Financial Sector" },
    { name: "Foreign Trade and International Finance" },
    { name: "Government Operations and Politics" },
    { name: "Health" },
    { name: "Housing and Community Development" },
    { name: "Immigration" },
    { name: "International Affairs" },
    { name: "Labor and Employment" },
    { name: "Law" },
    { name: "Native Americans" },
    { name: "Public Lands and Natural Resources" },
    { name: "Science, Technology, Communications" },
    { name: "Social Sciences and History" },
    { name: "Social Welfare" },
    { name: "Sports and Recreation" },
    { name: "Taxation" },
    { name: "Transportation and Public Works " },
    { name: "Water Resources Development" },
  ];

  const [selected, setSelected] = useState(plans[0]);
  const senatorLegislation =
    trpc.legislation.infiniteSenatorLegislation.useInfiniteQuery(
      {
        limit: 4,
        policyArea:
          selected?.name != plans[0]?.name ? selected?.name : undefined,
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getNextPageParam(lastPage: any) {
          return lastPage.nextCursor;
        },
      }
    );

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) senatorLegislation.fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  if (senatorLegislation.isFetching && !senatorLegislation.isFetchingNextPage) {
    return (
      <>
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        <RadioGroupOptions selected={selected!} setSelected={setSelected} />
        <div className="my-8 flex w-full justify-center">
          <Image src="/grid.svg" height={32} width={32} alt="Loader" />
        </div>
      </>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
      <RadioGroupOptions selected={selected!} setSelected={setSelected} />
      {selected?.name === plans[0]?.name
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                        sponsorMemberType={legislation.sponsorMemberType}
                        sponsorId={legislation.sponsorId}
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
                      sponsorMemberType={legislation.sponsorMemberType}
                      sponsorId={legislation.sponsorId}
                    />
                  </div>
                );
              })
          )
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                        sponsorMemberType={legislation.sponsorMemberType}
                        sponsorId={legislation.sponsorId}
                      />
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
                      sponsorMemberType={legislation.sponsorMemberType}
                      sponsorId={legislation.sponsorId}
                    />
                  </div>
                );
              })
          )}
      {senatorLegislation.hasNextPage ? null : (
        <p className="mb-8 text-center">You have reached the end of the page</p>
      )}
    </>
  );
};

export default SenatorLegislation;
