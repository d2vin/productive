import { GoogleMap, InfoWindow } from "@react-google-maps/api";
import { Tab } from "@headlessui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useMemo, useState, Fragment } from "react";
import Header from "../components/header";
import PlacesAutocomplete from "../components/places-autocomplete";
import { useLoadScript } from "@react-google-maps/api";
import SessionSidebar from "../components/session-sidebar";
import { Dialog, Transition } from "@headlessui/react";

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
  office: string;
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

const Index = () => {
  const { data: session } = useSession();
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string;
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries: ["places"],
  });
  const [address, setAddress] = useState<string>("");
  const [offices, setOffices] = useState<Office[]>([]);
  const [officials, setOfficials] = useState<Official[]>([]);
  const [state, setState] = useState<State[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [pollingLocations, setPollingLocations] = useState<PollingLocation[]>(
    []
  );
  const center = useMemo(() => ({ lat: 40.7351, lng: -73.9945 }), []);
  const [selected, setSelected] = useState(center);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (event: any) => {
    event.preventDefault();
    const electionId = 2000;
    if (!address) return;

    const url = "https://www.googleapis.com/civicinfo/v2/voterinfo";
    const params = {
      key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
      address,
      electionId: electionId,
    };

    const repUrl = "https://www.googleapis.com/civicinfo/v2/representatives";
    const repParams = {
      key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
      address: address,
    };

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

    axios
      .get(repUrl, { params: repParams })
      .then((response) => {
        console.log(response);
        if (!response.data) return;
        const repData = response.data;
        setOffices(repData.offices);
        setOfficials(repData.officials);
      })
      .catch((error) => {
        return error;
      });
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const [categories] = useState({
    Representatives: [
      {
        id: 1,
        title: "Does drinking coffee make you smarter?",
        date: "5h ago",
        commentCount: 5,
        shareCount: 2,
      },
      {
        id: 2,
        title: "So you've bought coffee... now what?",
        date: "2h ago",
        commentCount: 3,
        shareCount: 2,
      },
    ],
    "Voter Details": [
      {
        id: 1,
        title: "Is tech making coffee better or worse?",
        date: "Jan 7",
        commentCount: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: "The most innovative things happening in coffee",
        date: "Mar 19",
        commentCount: 24,
        shareCount: 12,
      },
    ],
  });

  if (isLoaded)
    return (
      <>
        <div className="h-screen overflow-y-scroll bg-gray-50 scrollbar-hide">
          <div className="mb-16">
            <Header message={"Productive"} />
          </div>
          <main
          // className={`mx-auto grid grid-cols-1 md:max-w-3xl md:grid-cols-2 xl:max-w-6xl xl:grid-cols-3 ${
          //   !session && "!max-w-3xl !grid-cols-1"
          // }`}
          >
            <section
            // className="col-span-2 mx-2 lg:mx-0"
            >
              <div
              // headless ui modal here
              >
                <div className="fixed bottom-4 left-[50%] z-10 flex translate-x-[-50%] items-center justify-center">
                  <button
                    type="button"
                    onClick={openModal}
                    className="rounded-md bg-black bg-opacity-50 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 hover:bg-opacity-30"
                  >
                    View Voter Details
                  </button>
                </div>

                <Transition appear show={isOpen} as={Fragment}>
                  <Dialog
                    as="div"
                    className="relative z-20"
                    onClose={closeModal}
                  >
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                      <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
                          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <Tab.Group>
                              <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                                <Dialog.Title
                                  as="h3"
                                  className="flex flex-1 text-lg font-medium leading-6 text-gray-900"
                                >
                                  <Tab
                                    className={({ selected }) =>
                                      classNames(
                                        "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-slate-400",
                                        "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none",
                                        selected
                                          ? "bg-white text-gray-400 shadow-md"
                                          : "text-gray-100 hover:bg-white/[0.12] hover:text-slate-600"
                                      )
                                    }
                                  >
                                    Voter Details
                                  </Tab>
                                </Dialog.Title>
                                <Dialog.Title
                                  as="h3"
                                  className="flex flex-1 text-lg font-medium leading-6 text-gray-900"
                                >
                                  <Tab
                                    className={({ selected }) =>
                                      classNames(
                                        "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-slate-400",
                                        "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none",
                                        selected
                                          ? "bg-white text-gray-400 shadow-md"
                                          : "text-gray-100 hover:bg-white/[0.12] hover:text-slate-600"
                                      )
                                    }
                                  >
                                    Representatives
                                  </Tab>
                                </Dialog.Title>
                              </Tab.List>
                              <Tab.Panels>
                                <Tab.Panel>
                                  <div className="mt-4 h-16 space-y-2 overflow-y-scroll scrollbar-none">
                                    {pollingLocations != undefined &&
                                    pollingLocations.length > 0 ? (
                                      pollingLocations.map(
                                        (pollingLocation, k) => (
                                          <>
                                            <div
                                              className="flex w-full justify-between rounded-lg border border-gray-300 p-4 align-middle"
                                              key={k}
                                            >
                                              <div>
                                                <p>
                                                  {
                                                    pollingLocation.address
                                                      .locationName
                                                  }
                                                </p>
                                                <p>
                                                  {
                                                    pollingLocation.address
                                                      .line1
                                                  }
                                                  ,{" "}
                                                  {pollingLocation.address.city}
                                                  ,{" "}
                                                  {
                                                    pollingLocation.address
                                                      .state
                                                  }{" "}
                                                  {pollingLocation.address.zip}
                                                </p>
                                                {pollingLocation.startDate ===
                                                pollingLocation.endDate ? (
                                                  <>
                                                    <p>
                                                      Election Day:{" "}
                                                      {pollingLocation.endDate}
                                                    </p>
                                                  </>
                                                ) : (
                                                  <>
                                                    <p>
                                                      Start Date:{" "}
                                                      {
                                                        pollingLocation.startDate
                                                      }
                                                    </p>
                                                    <p>
                                                      End Date:{" "}
                                                      {pollingLocation.endDate}
                                                    </p>
                                                  </>
                                                )}
                                                <p>
                                                  {pollingLocation.pollingHours}
                                                </p>
                                              </div>
                                              <button className="self-start rounded-lg border border-gray-300 px-2 hover:bg-gray-300">
                                                Save
                                              </button>
                                            </div>
                                          </>
                                        )
                                      )
                                    ) : (
                                      <p className="mt-4 rounded-lg border bg-white p-4 text-center">
                                        Enter an adress to find voter details
                                      </p>
                                    )}
                                  </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                  {" "}
                                  {offices.length > 0 ? (
                                    <>
                                      <div className="mt-4 h-16 space-y-2 overflow-y-scroll scrollbar-none">
                                        {offices.map((office, k) => (
                                          <div
                                            key={k}
                                            className="w-full rounded-lg border border-gray-300 p-4"
                                          >
                                            {office.name}:{" "}
                                            {
                                              officials[
                                                office
                                                  ?.officialIndices[0] as number
                                              ]?.name
                                            }
                                          </div>
                                        ))}
                                      </div>
                                    </>
                                  ) : (
                                    <p className="mt-4 rounded-lg border bg-white p-4 text-center">
                                      Enter an adress to find representatives
                                    </p>
                                  )}
                                </Tab.Panel>
                              </Tab.Panels>
                            </Tab.Group>

                            <div className="mt-4">
                              <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 hover:bg-blue-200"
                                onClick={closeModal}
                              >
                                Close
                              </button>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
                <GoogleMap
                  zoom={10}
                  center={selected}
                  mapContainerClassName="h-screen w-full max-w-7xl mx-auto"
                  options={{
                    mapTypeControl: false,
                    fullscreenControl: false,
                    streetViewControl: false,
                    zoomControl: false,
                  }}
                >
                  <form onSubmit={onSubmit}>
                    <PlacesAutocomplete
                      setSelected={setSelected}
                      setAddress={setAddress}
                      address={address}
                      onSubmit={onSubmit}
                    />
                  </form>

                  {pollingLocations != undefined
                    ? pollingLocations.map((pollingLocation, k) => (
                        <InfoWindow position={center} key={k}>
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
              </div>
            </section>
            {session && <SessionSidebar />}
          </main>
        </div>
      </>
    );
};

export default Index;
