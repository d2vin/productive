import { NextPage } from "next";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import axios from "axios";
import { GoogleMap, useLoadScript, InfoWindow } from "@react-google-maps/api";
import { useSession } from "next-auth/react";
import MiniProfile from "../../components/mini-profile";
import BookmarkedOfficials from "../../components/bookmarked-officials";
import Header from "../../components/header";
import { GetServerSideProps } from "next";
import { Tab } from "@headlessui/react";

type PollingLocation = {
  address: {
    locationName: string;
    line1: string;
    city: string;
    state: string;
    zip: string;
  };
  endDate: string;
  latitude: number;
  longitude: number;
  pollingHours: string;
  startDate: string;
};

type Contest = {
  ballotTitle: string;
  candidates: {
    name: string;
    party: string;
  }[];
  district: {
    name: string;
  };
  type: string;
  referendumTitle?: string;
  referendumSubtitle?: string;
  referendumUrl?: string;
  referendumBallotResponses?: [];
};

type State = {
  electionAdministrationBody: {
    name: string;
    electionInfoUrl: string;
    electionRegistrationUrl: string;
    electionRegistrationConfirmationUrl: string;
    absenteeVotingInfoUrl: string;
  };
  name: string;
};

type RepAddress = {
  line1: string;
  city: string;
  state: string;
  zip: string;
};

type Channel = {
  type: string;
  id: string;
};

type Official = {
  name: string;
  address: RepAddress[];
  party: string;
  phones: string[];
  urls: string[];
  channels: Channel[];
};

type Office = {
  name: string;
  divisionId: string;
  levels: string[];
  roles: string[];
  officialIndices: number[];
};

interface ResultsProps {
  data: {
    pollingLocations: PollingLocation[];
    contests: Contest[];
    state: State[];
  };
  address: string;
  repData: { offices: Office[]; officials: Official[] };
}

const Results: NextPage<ResultsProps> = ({ data, address, repData }) => {
  const { data: session } = useSession();
  const [search, setSearch] = useState<string>("Polling Locations");
  const [dropdown, setDropdown] = useState<boolean>();
  const [searchAddress, setSearchAddress] = useState<string>();
  const [offices, setOffices] = useState<Office[]>([]);
  const [officials, setOfficials] = useState<Official[]>([]);
  const [state, setState] = useState<State[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [pollingLocations, setPollingLocations] = useState<PollingLocation[]>(
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setPollingLocations(data?.pollingLocations);
      setContests(data?.contests);
      setState(data?.state);
      setSearchAddress(address);
      setOffices(repData?.offices);
      setOfficials(repData?.officials);
    }, 1000);
    return () => clearTimeout(timer);
  }, [
    data?.pollingLocations,
    data?.contests,
    data?.state,
    address,
    repData?.officials,
    repData?.offices,
  ]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
  });

  const center = useMemo(() => ({ lat: 40.7351, lng: -73.9945 }), []);

  const containerStyle = {
    width: "full",
    height: "50vh",
    borderRadius: "10px",
    marginBottom: "1rem",
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <div className="bg-gray-50-h-screen overflow-y-scroll scrollbar-hide">
        <div className="mb-16">
          <Header message={"Productive"} />
        </div>
        <main
          className={`mx-auto grid grid-cols-1 md:max-w-3xl md:grid-cols-2 xl:max-w-6xl xl:grid-cols-3 ${
            !session && "!max-w-3xl !grid-cols-1"
          }`}
        >
          <section className="col-span-2 mx-2 lg:mx-0">
            <div className="my-7 max-w-2xl space-y-2 rounded-lg border bg-white p-4 sm:max-w-6xl">
              {isLoaded && (
                <GoogleMap
                  zoom={10}
                  center={center}
                  mapContainerStyle={containerStyle}
                >
                  {pollingLocations.length > 0
                    ? pollingLocations.map((pollingLocation, k) => (
                        <InfoWindow
                          position={{
                            lat: pollingLocation.latitude,
                            lng: pollingLocation.longitude,
                          }}
                          key={k}
                        >
                          <div className="text-center">
                            <p>{pollingLocation.address.locationName}</p>
                            <p>{pollingLocation.address.line1}</p>
                            <p>
                              {pollingLocation.address.city},{" "}
                              {pollingLocation.address.state}{" "}
                              {pollingLocation.address.zip}
                            </p>
                          </div>
                        </InfoWindow>
                      ))
                    : null}
                </GoogleMap>
              )}
              <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                        "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                        selected
                          ? "bg-white shadow"
                          : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                      )
                    }
                  >
                    Your Voter Information
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                        "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                        selected
                          ? "bg-white shadow"
                          : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                      )
                    }
                  >
                    Your Representative Information
                  </Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <label className="my-7 block text-sm font-medium">
                      Election Resources
                    </label>
                    <div className="my-7 max-w-2xl space-y-2 rounded-lg border bg-white p-4 sm:max-w-6xl">
                      {state.map((s, k) => (
                        <div
                          className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2"
                          key={k}
                        >
                          <a
                            className="flex-1 rounded-md border p-2 text-center hover:bg-gray-300"
                            href={s.electionAdministrationBody.electionInfoUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Election Information
                          </a>
                          <a
                            className="flex-1 rounded-md border p-2 text-center hover:bg-gray-300"
                            href={
                              s.electionAdministrationBody
                                .electionRegistrationUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            Election Registration
                          </a>
                          <a
                            className="flex-1 rounded-md border p-2 text-center hover:bg-gray-300"
                            href={
                              s.electionAdministrationBody.absenteeVotingInfoUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            Absentee Voting
                          </a>
                        </div>
                      ))}
                    </div>
                    <label className="my-7 block text-sm font-medium">
                      Upcoming Elections
                    </label>
                    {contests.length > 0 &&
                      contests.map((contest, k) => (
                        <div
                          className="my-7 max-w-2xl space-y-2 rounded-lg border bg-white p-4 sm:max-w-6xl"
                          key={k}
                        >
                          <div className="flex justify-between align-middle">
                            <p>
                              {contest.ballotTitle}
                              {contest.district.name.includes(
                                contest.ballotTitle
                              )
                                ? null
                                : ": " + contest.district.name}
                              <br />
                              {contest.type === "Referendum" && (
                                <div className="w-full">
                                  {contest.referendumSubtitle}
                                  <br />
                                  <br />
                                  <div className="flex space-x-2">
                                    {contest.referendumBallotResponses?.map(
                                      (response, k) => {
                                        return (
                                          <div
                                            className="w-full flex-1"
                                            key={k}
                                          >
                                            <button className="w-full flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2 hover:bg-gray-300">
                                              {response}
                                            </button>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                  <br />
                                  <button className="rounded-lg border border-gray-600 bg-gray-50 p-2 hover:bg-gray-300">
                                    <a
                                      href={contest.referendumUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      Learn More
                                    </a>
                                  </button>
                                </div>
                              )}
                            </p>
                          </div>
                          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                            {contest.candidates &&
                              contest.candidates.map((candidate, k) => (
                                <button
                                  key={k}
                                  className={`bg-${
                                    candidate.party === "Republican Party"
                                      ? "red"
                                      : candidate.party === "Democratic Party"
                                      ? "indigo"
                                      : "slate"
                                  }-400 flex-1 rounded-md p-2 text-center`}
                                >
                                  {candidate.name}
                                </button>
                              ))}
                          </div>
                        </div>
                      ))}
                    <label className="my-7 block text-sm font-medium">
                      Your polling locations
                    </label>
                    <div className="my-7 max-w-2xl space-y-2 rounded-lg border bg-white p-4 sm:max-w-6xl">
                      {pollingLocations.length > 0 &&
                        pollingLocations.map((pollingLocation, k) => (
                          <div
                            className="flex justify-between align-middle"
                            key={k}
                          >
                            <div>
                              <p>{pollingLocation.address.locationName}</p>
                              <p>
                                {pollingLocation.address.line1},{" "}
                                {pollingLocation.address.city},{" "}
                                {pollingLocation.address.state}{" "}
                                {pollingLocation.address.zip}
                              </p>
                              {pollingLocation.startDate ===
                              pollingLocation.endDate ? (
                                <>
                                  <p>Election Day: {pollingLocation.endDate}</p>
                                </>
                              ) : (
                                <>
                                  <p>Start Date: {pollingLocation.startDate}</p>
                                  <p>End Date: {pollingLocation.endDate}</p>
                                </>
                              )}
                              <p>{pollingLocation.pollingHours}</p>
                            </div>
                            <button className="self-start rounded-lg border border-gray-300 px-2 hover:bg-gray-300">
                              Save
                            </button>
                          </div>
                        ))}
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div className="space-y-2">
                      {offices.length > 0 &&
                        offices.map((office, k) => (
                          <div
                            key={k}
                            className="w-full rounded-lg border border-gray-300 p-2"
                          >
                            {office.name}:{" "}
                            {
                              officials[office?.officialIndices[0] as number]
                                ?.name
                            }
                          </div>
                        ))}
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </section>
          {session && (
            <section className="hidden md:col-span-1 xl:inline-grid">
              <div className="fixed top-20">
                {/* Mini Profile */}
                <MiniProfile />
                {/* Suggestions */}
                <BookmarkedOfficials message={"Bookmarked Officials "} />
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default Results;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const address = context.params?.address as string;
  console.log("address", address);

  const electionId = 8000;
  const url = "https://www.googleapis.com/civicinfo/v2/voterinfo";
  const params = {
    key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    address: address,
    electionId: electionId,
  };

  const response = await axios.get(url, { params });
  const data = await response.data;
  console.log(data.contests);

  const repUrl = "https://www.googleapis.com/civicinfo/v2/representatives";
  const repParams = {
    key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    address: address,
  };

  const repResponse = await axios.get(repUrl, { params: repParams });
  const repData = await repResponse.data;

  return {
    props: { data: data, repData: repData, address: address },
  };
};
