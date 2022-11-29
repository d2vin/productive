import { GoogleMap, InfoWindow } from "@react-google-maps/api";
import { Tab } from "@headlessui/react";
import axios from "axios";
import React, { useMemo, useState, Fragment, useEffect, useRef } from "react";
import Header from "../components/header";
import PlacesAutocomplete from "../components/places-autocomplete";
import { useLoadScript } from "@react-google-maps/api";
import { Dialog, Transition } from "@headlessui/react";
import PollingLocation from "../components/polling-location";
import { LinkIcon } from "@heroicons/react/solid";

type TypeOfPollingLocation = {
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
  const [pollingLocations, setPollingLocations] = useState<
    TypeOfPollingLocation[] | null
  >([]);
  const center = useMemo(() => ({ lat: 40.7351, lng: -73.9945 }), []);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [selected, setSelected] = useState(center);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (event: any) => {
    event.preventDefault();
    const electionId = 2000;
    if (!address) {
      console.log("no address");
      return;
    }

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
        if (!response.data) {
          setPollingLocations(null);
        }
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
    setSubmitted(true);
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

  const form = useRef<HTMLFormElement>(null);

  useEffect(() => console.log("Polling locations updated"), [pollingLocations]);

  if (isLoaded)
    return (
      <>
        <div className="h-screen overflow-y-scroll bg-gray-50 scrollbar-hide">
          <div className="mb-16">
            <Header message={"Productive"} />
          </div>
          <main>
            <section>
              <div>
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
                          <Dialog.Panel className="h-96 w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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
                                  {pollingLocations != undefined &&
                                  pollingLocations.length > 0 ? (
                                    <div className="mt-4 h-56 space-y-2 overflow-y-scroll scrollbar-none">
                                      {pollingLocations.map(
                                        (pollingLocation, k) => (
                                          <PollingLocation
                                            key={k}
                                            pollingLocation={pollingLocation}
                                          />
                                        )
                                      )}
                                    </div>
                                  ) : (
                                    <p className="mt-4 rounded-lg border bg-white p-4 text-center">
                                      Enter an adress to find voter details
                                    </p>
                                  )}
                                </Tab.Panel>
                                <Tab.Panel>
                                  {offices.length > 0 ? (
                                    <>
                                      <div className="mt-4 h-56 space-y-2 overflow-y-scroll scrollbar-none">
                                        {offices.map((office, k) => (
                                          <div
                                            key={k}
                                            className="flex w-full items-center justify-between rounded-lg border border-gray-300 p-4"
                                          >
                                            <div>
                                              {office.name}:<br />
                                              {
                                                officials[
                                                  office
                                                    ?.officialIndices[0] as number
                                                ]?.name
                                              }
                                            </div>
                                            <a
                                              target="_blank"
                                              href={
                                                officials[
                                                  office
                                                    ?.officialIndices[0] as number
                                                ]?.urls[0]
                                              }
                                              rel="noreferrer"
                                            >
                                              <LinkIcon className="h-6 cursor-pointer transition-all duration-150 ease-out hover:scale-125" />
                                            </a>
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
                  <form onSubmit={onSubmit} ref={form}>
                    <PlacesAutocomplete
                      setPollingLocations={setPollingLocations}
                      setSubmitted={setSubmitted}
                      setSelected={setSelected}
                      setAddress={setAddress}
                      address={address}
                      onSubmit={onSubmit}
                    />
                  </form>
                  {submitted && (
                    <div className="absolute left-72 top-3 z-10 transition-all duration-200">
                      <button
                        type="button"
                        onClick={openModal}
                        className="rounded-md bg-white px-4 py-1.5 text-base text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 hover:bg-opacity-80"
                      >
                        View Voter Details
                      </button>
                    </div>
                  )}
                  {address && !submitted && (
                    <div className="absolute left-72 top-3 z-10 transition-all duration-200">
                      <button
                        type="submit"
                        onClick={onSubmit}
                        className="rounded-md bg-white px-4 py-1.5 text-base text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 hover:bg-opacity-80"
                      >
                        Find Voter Details
                      </button>
                    </div>
                  )}

                  {(pollingLocations != undefined || null) &&
                    submitted &&
                    pollingLocations?.map((pollingLocation, k) => (
                      <InfoWindow position={selected} key={k}>
                        <div className="text-left">
                          <h1 className="font-semibold">
                            Your polling location
                          </h1>
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
                  {(pollingLocations === undefined || null) && submitted && (
                    <InfoWindow position={selected}>
                      <div className="text-left">
                        <h1 className="font-semibold">Sorry</h1>
                        <p>We couldn&apos;t find a polling </p>
                        <p>location for this address.</p>
                        <p>Please try another</p>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </div>
            </section>
          </main>
        </div>
      </>
    );
};

export default Index;
