import React, { useState, Fragment, useEffect, useRef } from "react";
import { trpc } from "../utils/trpc";
import Story from "./story";
import { Listbox, Transition } from "@headlessui/react";
import { BookmarkIcon, ChevronDownIcon } from "@heroicons/react/solid";
import LoadingStory from "./loading-story";

const officials = [
  { id: 0, name: "Senators", unavailable: false },
  { id: 1, name: "Representatives", unavailable: false },
];

const states = [
  { id: 0, name: "All", unavailable: true },
  { id: 1, name: "AL", unavailable: false },
  { id: 2, name: "AK", unavailable: false },
  { id: 3, name: "AZ", unavailable: false },
  { id: 4, name: "AR", unavailable: false },
  { id: 5, name: "CA", unavailable: false },
  { id: 6, name: "CO", unavailable: false },
  { id: 7, name: "CT", unavailable: false },
  { id: 8, name: "DE", unavailable: false },
  { id: 9, name: "FL", unavailable: false },
  { id: 10, name: "GA", unavailable: false },
  { id: 11, name: "HI", unavailable: false },
  { id: 12, name: "ID", unavailable: false },
  { id: 13, name: "IL", unavailable: false },
  { id: 14, name: "IN", unavailable: false },
  { id: 15, name: "IA", unavailable: false },
  { id: 16, name: "KS", unavailable: false },
  { id: 17, name: "KY", unavailable: false },
  { id: 18, name: "LA", unavailable: false },
  { id: 19, name: "ME", unavailable: false },
  { id: 20, name: "MD", unavailable: false },
  { id: 21, name: "MA", unavailable: false },
  { id: 22, name: "MI", unavailable: false },
  { id: 23, name: "MN", unavailable: false },
  { id: 24, name: "MS", unavailable: false },
  { id: 25, name: "MO", unavailable: false },
  { id: 26, name: "MT", unavailable: false },
  { id: 27, name: "NE", unavailable: false },
  { id: 28, name: "NV", unavailable: false },
  { id: 29, name: "NH", unavailable: false },
  { id: 30, name: "NJ", unavailable: false },
  { id: 31, name: "NM", unavailable: false },
  { id: 32, name: "NY", unavailable: false },
  { id: 33, name: "NC", unavailable: false },
  { id: 34, name: "ND", unavailable: false },
  { id: 35, name: "OH", unavailable: false },
  { id: 36, name: "OK", unavailable: false },
  { id: 37, name: "OR", unavailable: false },
  { id: 38, name: "PA", unavailable: false },
  { id: 39, name: "RI", unavailable: false },
  { id: 40, name: "SC", unavailable: false },
  { id: 41, name: "SD", unavailable: false },
  { id: 42, name: "TN", unavailable: false },
  { id: 43, name: "TX", unavailable: false },
  { id: 44, name: "UT", unavailable: false },
  { id: 45, name: "VT", unavailable: false },
  { id: 46, name: "VI", unavailable: false },
  { id: 47, name: "WA", unavailable: false },
  { id: 48, name: "WV", unavailable: false },
  { id: 49, name: "WI", unavailable: false },
  { id: 50, name: "WY", unavailable: false },
];

const Stories: React.FC = () => {
  // stories filter state
  const [selected, setSelected] = useState(officials[0]);
  const [selectedState, setSelectedState] = useState(states[0]);
  // senator and representative infintie queries
  const senators = trpc.senator.infiniteSenators.useInfiniteQuery(
    {
      limit: 12,
      state:
        selectedState?.name != states[0]?.name
          ? selectedState?.name
          : undefined,
    },
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getNextPageParam(lastPage: any) {
        return lastPage.nextCursor;
      },
    }
  );
  const representatives =
    trpc.representative.infiniteRepresentatives.useInfiniteQuery(
      {
        limit: 12,
        state:
          selectedState?.name != states[0]?.name
            ? selectedState?.name
            : undefined,
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getNextPageParam(lastPage: any) {
          return lastPage.nextCursor;
        },
      }
    );
  // fetch calls
  const fetchMoreSenators = () => senators.fetchNextPage();
  const fetchMoreRepresentatives = () => representatives.fetchNextPage();
  // sidebar ref
  const ref = useRef<HTMLDivElement>(null);
  // sidebar useEffect
  useEffect(() => {
    const element = ref.current;
    let distanceScrolled;
    let elementWidth;
    let scrollbarWidth;
    const onScroll = () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      distanceScrolled = element!.scrollLeft;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      elementWidth = element!.offsetWidth;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      scrollbarWidth = element!.scrollWidth;
      console.log(distanceScrolled + elementWidth > scrollbarWidth);
      if (distanceScrolled + elementWidth > scrollbarWidth) {
        if (selected?.name === "Senators") {
          fetchMoreSenators();
        } else {
          fetchMoreRepresentatives();
        }
      }
    };
    element?.addEventListener("scroll", onScroll);
    return () => {
      element?.removeEventListener("scroll", onScroll);
    };
  });

  return (
    <>
      <div
        ref={ref}
        className="mt-8 h-48 flex-col justify-center space-y-4 overflow-x-scroll rounded-sm border border-gray-200 bg-white p-4 align-middle scrollbar-thin scrollbar-thumb-black"
      >
        <div className="sticky z-10 flex max-w-xl space-x-2">
          <Listbox value={selected} onChange={setSelected}>
            <div className="relative">
              <Listbox.Button className="relative w-48 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">{selected?.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-48 overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {officials.map((official, k) => (
                    <Listbox.Option
                      key={k}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? "bg-gray-100 text-black" : "text-gray-800"
                        }`
                      }
                      value={official}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {official.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                              <BookmarkIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
          <Listbox value={selectedState} onChange={setSelectedState}>
            <div className="relative">
              <Listbox.Button className="relative w-24 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">{selectedState?.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-20 mt-1 max-h-28 w-48 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {states.map((state, k) => (
                    <Listbox.Option
                      key={k}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? "bg-gray-100 text-black" : "text-gray-800"
                        }`
                      }
                      value={state}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {state.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                              <BookmarkIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
        <div className="flex space-x-2">
          {selected?.name === "Senators" &&
            (selectedState != states[0]
              ? senators.isFetching
                ? [...Array(12)].map((senator, k) => {
                    return (
                      <div key={k}>
                        {" "}
                        <LoadingStory />
                      </div>
                    );
                  })
                : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  senators?.data?.pages?.map((page: { items: any[] }) =>
                    page?.items
                      .filter(
                        (senator) => selectedState?.name === senator.state
                      )
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ?.map((profile: any) => {
                        return (
                          <Story
                            key={profile.bioguideId}
                            image={`https://theunitedstates.io/images/congress/225x275/${profile.bioguideId}.jpg`}
                            firstName={profile.firstName}
                            lastName={profile.lastName}
                            id={profile.bioguideId}
                            office={selected?.name}
                          />
                        );
                      })
                  )
              : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                senators?.data?.pages?.map((page: { items: any[] }) =>
                  page?.items
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ?.map((profile: any) => {
                      return (
                        <Story
                          key={profile.bioguideId}
                          image={`https://theunitedstates.io/images/congress/225x275/${profile.bioguideId}.jpg`}
                          firstName={profile.firstName}
                          lastName={profile.lastName}
                          id={profile.bioguideId}
                          office={selected.name}
                        />
                      );
                    })
                ))}
          {selected?.name === "Representatives" &&
            (selectedState != states[0]
              ? representatives.isFetching
                ? [...Array(12)].map((representative, k) => {
                    return (
                      <div key={k}>
                        {" "}
                        <LoadingStory />
                      </div>
                    );
                  })
                : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  representatives?.data?.pages?.map((page: { items: any[] }) =>
                    page?.items
                      .filter(
                        (representative) =>
                          selectedState?.name === representative.state
                      )
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ?.map((profile: any) => {
                        return (
                          <Story
                            key={profile.bioguideId}
                            image={`https://theunitedstates.io/images/congress/225x275/${profile.bioguideId}.jpg`}
                            firstName={profile.firstName}
                            lastName={profile.lastName}
                            id={profile.bioguideId}
                            office={selected?.name}
                          />
                        );
                      })
                  )
              : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                representatives?.data?.pages?.map((page: { items: any[] }) =>
                  page?.items
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ?.map((profile: any) => {
                      return (
                        <Story
                          key={profile.bioguideId}
                          image={`https://theunitedstates.io/images/congress/225x275/${profile.bioguideId}.jpg`}
                          firstName={profile.firstName}
                          lastName={profile.lastName}
                          id={profile.bioguideId}
                          office={selected.name}
                        />
                      );
                    })
                ))}
        </div>
      </div>
    </>
  );
};

export default Stories;
