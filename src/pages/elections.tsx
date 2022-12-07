import { GoogleMap, InfoWindow } from "@react-google-maps/api";
import { Tab } from "@headlessui/react";
import axios from "axios";
import React, { useMemo, useState, Fragment, useRef } from "react";
import Header from "../components/header";
import PlacesAutocomplete from "../components/places-autocomplete";
import { useLoadScript } from "@react-google-maps/api";
import { Dialog, Transition } from "@headlessui/react";
import PollingLocation from "../components/polling-location";
import { BookmarkIcon, LinkIcon, UserIcon } from "@heroicons/react/solid";
import { trpc } from "../utils/trpc";
import { signIn, useSession } from "next-auth/react";
import Official from "../components/official";

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

type TypeOfOfficial = {
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
  const [officials, setOfficials] = useState<TypeOfOfficial[]>([]);
  const [state, setState] = useState<State[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [pollingLocations, setPollingLocations] = useState<
    TypeOfPollingLocation[] | null
  >([]);
  const center = useMemo(() => ({ lat: 40.7351, lng: -73.9945 }), []);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [selected, setSelected] = useState(center);
  const { data: session } = useSession();

  const officialMutation = trpc.official.saveOfficial.useMutation();

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

  const handleSaveOfficialClick = async (officialIndex: number) => {
    console.log("saving official");
    await saveOfficial(officialIndex);
  };

  const saveOfficial = async (officialIndex: number) => {
    const userId = session?.user?.id;
    const office = offices[officialIndex]?.name;
    const name = officials[officialIndex]?.name;
    const party = officials[officialIndex]?.party;
    const channel = officials[officialIndex]?.channels[0]?.type;
    const channelId = officials[officialIndex]?.channels[0]?.id;
    const url = officials[officialIndex]?.urls[0];
    const wikiUrl = officials[officialIndex]?.urls[1];
    await officialMutation.mutate({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      userId: userId!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      name: name!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      party: party!,
      office: office,
      channel: channel,
      channelId: channelId,
      url: url,
      wikiUrl: wikiUrl,
      // photoUrl: z.string().optional(),
      // bioguideId: z.string().optional(),
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

  const form = useRef<HTMLFormElement>(null);

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
                                    Polling Locations
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
                                    <div className="mt-4 h-56 space-y-2 overflow-y-scroll scrollbar-none">
                                      <p className="rounded-lg border bg-white p-4 text-center">
                                        Polling location not found
                                      </p>
                                    </div>
                                  )}
                                </Tab.Panel>
                                <Tab.Panel>
                                  {offices.length > 0 ? (
                                    <>
                                      <div className="mt-4 h-56 space-y-2 overflow-y-scroll scrollbar-none">
                                        {offices.map((office, k) => (
                                          <>
                                            <Official
                                              key={k}
                                              office={office.name}
                                              official={
                                                officials[
                                                  office
                                                    ?.officialIndices[0] as number
                                                ]?.name as string
                                              }
                                              party={
                                                officials[
                                                  office
                                                    ?.officialIndices[0] as number
                                                ]?.party as string
                                              }
                                              channel={
                                                officials[
                                                  office
                                                    ?.officialIndices[0] as number
                                                ]?.channels[0]?.type as string
                                              }
                                              channelId={
                                                officials[
                                                  office
                                                    ?.officialIndices[0] as number
                                                ]?.channels[0]?.id as string
                                              }
                                              url={
                                                officials[
                                                  office
                                                    ?.officialIndices[0] as number
                                                ]?.urls[0] as string
                                              }
                                              wikiUrl={
                                                officials[
                                                  office
                                                    ?.officialIndices[0] as number
                                                ]?.urls[1] as string
                                              }
                                              photoUrl={""}
                                              saved={false}
                                            />
                                          </>
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
                        className="w-20 rounded-md bg-white px-4 py-1.5 text-base text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 hover:bg-opacity-80"
                      >
                        View
                      </button>
                    </div>
                  )}
                  {address && !submitted && (
                    <div className="absolute left-72 top-3 z-10 transition-all duration-200">
                      <button
                        type="submit"
                        onClick={onSubmit}
                        className="w-20 rounded-md bg-white px-4 py-1.5 text-base text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 hover:bg-opacity-80"
                      >
                        Find
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
