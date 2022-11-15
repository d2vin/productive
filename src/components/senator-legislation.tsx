import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { trpc } from "../utils/trpc";
import Legislation from "./legislation";
import Image from "next/image";
import { RadioGroup } from "@headlessui/react";

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

  console.log(selected, plans[0]);

  return (
    <>
      <div className="w-full">
        <div className="w-full">
          <RadioGroup value={selected} onChange={setSelected}>
            <div className="flex space-x-4 overflow-x-scroll p-2">
              {plans.map((plan) => (
                <RadioGroup.Option
                  key={plan.name}
                  value={plan}
                  className={({ active }) =>
                    `${
                      active
                        ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
                        : ""
                    }
                    relative w-full cursor-pointer rounded-lg px-4 py-2 shadow-md focus:outline-none`
                  }
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="truncate text-sm">
                        <RadioGroup.Label>{plan.name}</RadioGroup.Label>
                      </div>
                    </div>
                  </div>
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>
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
          )}
    </>
  );
};

export default SenatorLegislation;
