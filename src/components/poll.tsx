import React, { useState, useMemo } from "react";
import axios from "axios";
import { GoogleMap, useLoadScript, InfoWindow } from "@react-google-maps/api";

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

const Poll: React.FC = () => {
  const [search, setSearch] = useState<string>("Polling Locations");
  const [dropdown, setDropdown] = useState<boolean>();
  const [state, setState] = useState<State[]>([]);
  const [address, setAddress] = useState<string>();
  const [contests, setContests] = useState<Contest[]>([]);
  const [pollingLocations, setPollingLocations] = useState<PollingLocation[]>(
    []
  );

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (event: any) => {
    event.preventDefault();
    let url;
    let params;
    const electionId = 8000;
    if (!address) return;

    switch (search) {
      case "Polling Locations":
        url = "https://www.googleapis.com/civicinfo/v2/voterinfo";
        params = {
          key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
          address,
          electionId: electionId,
        };
        break;
      case "Officials":
        url = "https://www.googleapis.com/civicinfo/v2/representatives";
        params = {
          key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
          address,
        };
        break;
      default:
        url = "https://www.googleapis.com/civicinfo/v2/voterinfo";
        params = {
          key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
          address,
          electionId: electionId,
        };
        break;
    }

    axios
      .get(url, { params })
      .then((response) => {
        console.log(response);
        if (!response.data) return;
        const data = response.data;
        setPollingLocations(data.pollingLocations);
        setContests(data.contests);
        setState(data.state);
      })
      .catch((error) => {
        return error;
      });
  };

  return (
    <div className="my-7 max-w-2xl space-y-2 rounded-lg border bg-white p-4 sm:max-w-6xl">
      <form onSubmit={onSubmit}>
        <div className="flex">
          <button
            className="z-10 inline-flex flex-shrink-0 items-center rounded-l-lg border border-gray-300 bg-white py-2.5 px-4 text-center text-sm font-medium text-black focus:outline-none hover:bg-gray-300"
            onClick={() => setDropdown(!dropdown)}
            type="button"
          >
            {search}{" "}
            <svg
              aria-hidden="true"
              className="ml-1 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
          {dropdown && (
            <div className="absolute z-10 mt-12 w-44 divide-y divide-gray-100 rounded bg-white shadow">
              <ul className="py-1 text-sm text-black">
                <li>
                  <button
                    onClick={() => {
                      setSearch("Polling Locations");
                      setDropdown(false);
                    }}
                    type="button"
                    className="inline-flex w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Polling Locations
                  </button>
                </li>
                {/* <li>
                  <button
                    onClick={() => {
                      setSearch("Officials");
                      setDropdown(false);
                    }}
                    type="button"
                    className="inline-flex w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Officials
                  </button>
                </li> */}
              </ul>
            </div>
          )}
          <div className="relative w-full">
            <input
              type="search"
              className="z-20 block w-full rounded-r-lg border border-l-2 border-gray-300 border-l-gray-50 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Address"
              required
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
            <button
              type="submit"
              className="absolute top-0 right-0 rounded-r-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white focus:outline-none hover:bg-blue-800"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </div>
        </div>
      </form>
      {isLoaded ? (
        <GoogleMap zoom={10} center={center} mapContainerStyle={containerStyle}>
          {pollingLocations.length > 0 &&
            pollingLocations.map((pollingLocation, k) => (
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
            ))}
        </GoogleMap>
      ) : (
        <div>Loading...</div>
      )}
      <label className="my-7 block text-sm font-medium">
        Your upcoming elections
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
              href={s.electionAdministrationBody.electionRegistrationUrl}
              target="_blank"
              rel="noreferrer"
            >
              Election Registration
            </a>
            <a
              className="flex-1 rounded-md border p-2 text-center hover:bg-gray-300"
              href={s.electionAdministrationBody.absenteeVotingInfoUrl}
              target="_blank"
              rel="noreferrer"
            >
              Absentee Voting
            </a>
          </div>
        ))}
      </div>
      {contests.length > 0 &&
        contests.map((contest, k) => (
          <div
            className="my-7 max-w-2xl space-y-2 rounded-lg border bg-white p-4 sm:max-w-6xl"
            key={k}
          >
            <div className="flex justify-between align-middle">
              <p>
                {contest.ballotTitle}
                {contest.district.name.includes(contest.ballotTitle)
                  ? null
                  : ": " + contest.district.name}
              </p>
              <button className="rounded-lg border border-gray-300 px-2 hover:bg-gray-300">
                Save
              </button>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              {contest.candidates &&
                contest.candidates.map((candidate, k) => (
                  <div
                    key={k}
                    className={`bg-${
                      candidate.party === "Republican Party"
                        ? "red"
                        : candidate.party === "Democratic Party"
                        ? "indigo"
                        : "gray"
                    }-400 flex-1 rounded-md p-2 text-center`}
                  >
                    {candidate.name}
                  </div>
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
            <div className="flex justify-between align-middle" key={k}>
              <div>
                <p>{pollingLocation.address.locationName}</p>
                <p>
                  {pollingLocation.address.line1},{" "}
                  {pollingLocation.address.city},{" "}
                  {pollingLocation.address.state} {pollingLocation.address.zip}
                </p>
                {pollingLocation.startDate === pollingLocation.endDate ? (
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
    </div>
  );
};

export default Poll;
