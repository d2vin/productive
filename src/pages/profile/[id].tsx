import { signOut, useSession } from "next-auth/react";
import React, { Fragment, useState } from "react";
import Header from "../../components/header";
import { trpc } from "../../utils/trpc";
import Image from "next/image";
import { Tab } from "@headlessui/react";
import Legislation from "../../components/legislation";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import BookmarkedOfficial from "../../components/bookmarked-official";
import SessionSidebar from "../../components/session-sidebar";
import Official from "../../components/official";

const Profile: React.FC = () => {
  const { data: session } = useSession();
  const { data, status } =
    trpc.legislation.getUserVotesOnSponsoredLegislation.useQuery({
      userId: session?.user?.id as string,
    });
  const bookmarkedRepresentatives =
    trpc.representative.getBookmarkedRepresentatives.useQuery();
  const bookmarkedSenators = trpc.senator.getBookmarkedSenators.useQuery();
  const savedOfficials = trpc.official.getSavedOfficials.useQuery();

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

  if (!session && status != "loading") {
    return (
      <>
        <div className="mb-16">
          <Header message={"Productive"} />
        </div>
        <section className="h-screen bg-gray-50">
          <div className="mx-auto max-w-screen-xl py-8 px-4 lg:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center">
              <h1 className="text-primary-600 dark:text-primary-500 mb-4 text-7xl font-extrabold tracking-tight lg:text-9xl">
                404
              </h1>
              <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                Something&apos;s missing.
              </p>
              <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                Sorry, we can&apos;t find that page. You&apos;ll find lots to
                explore on the home page.{" "}
              </p>
              <Link href="/home">
                <a className="bg-primary-600 hover:bg-primary-800 focus:ring-primary-300 dark:focus:ring-primary-900 my-4 inline-flex rounded-lg px-5 py-2.5 text-center text-sm font-medium text-black focus:outline-none focus:ring-4">
                  Back to Homepage
                </a>
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (status === "loading") {
    return (
      <>
        <div className="mb-16">
          <Header message={"Productive"} />
        </div>
      </>
    );
  }
  return (
    <div className="h-screen overflow-y-scroll bg-gray-50 scrollbar-hide">
      <div className="mb-16">
        <Header message={"Productive"} />
      </div>
      <main
        className={`mx-auto grid grid-cols-1 md:max-w-3xl md:grid-cols-2 xl:max-w-6xl xl:grid-cols-3 ${
          !session && "!max-w-3xl !grid-cols-1"
        } h-screen`}
      >
        {/* Section */}
        <section className="col-span-2 mx-2 space-y-8 lg:mx-0">
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-20" onClose={closeModal}>
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
                              Senators
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
                            {bookmarkedSenators.status === "success" &&
                            bookmarkedSenators.data.length > 0 ? (
                              <div className="mt-4 h-56 space-y-2 overflow-y-scroll scrollbar-none">
                                {bookmarkedSenators.data
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                  ?.map((profile: any) => (
                                    <div
                                      key={profile.id}
                                      className="rounded-lg border bg-white p-2"
                                    >
                                      <BookmarkedOfficial
                                        key={profile.id}
                                        profile={profile}
                                      />
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <div className="mt-4 h-56 space-y-2 overflow-y-scroll scrollbar-none">
                                <p className="mt-4 rounded-lg border bg-white p-4 text-center">
                                  No Bookmarked Senators
                                </p>
                              </div>
                            )}
                          </Tab.Panel>
                          <Tab.Panel>
                            {bookmarkedRepresentatives.status === "success" &&
                            bookmarkedRepresentatives.data.length > 0 ? (
                              <div className="mt-4 h-56 space-y-2 overflow-y-scroll scrollbar-none">
                                {bookmarkedRepresentatives.data
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                  ?.map((profile: any) => (
                                    <div
                                      key={profile.id}
                                      className="rounded-lg border bg-white p-2"
                                    >
                                      <BookmarkedOfficial
                                        key={profile.id}
                                        profile={profile}
                                      />
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <div className="mt-4 h-56 space-y-2 overflow-y-scroll scrollbar-none">
                                <p className="rounded-lg border bg-white p-4 text-center">
                                  No Bookmarked Representatives
                                </p>
                              </div>
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
          <div className="mt-8 flex-col justify-center space-y-12 rounded-sm border border-gray-200 bg-white p-6 align-middle">
            <div className="flex items-center">
              <Image
                src={
                  typeof session?.user?.image === "string"
                    ? session?.user?.image
                    : "/productive.png"
                }
                height="64"
                width="64"
                alt="Profile"
                className="h-10 cursor-pointer rounded-full"
              />
              <div className="flex flex-1 flex-col justify-center space-y-2">
                <h1 className="mx-10 text-xl">
                  Welcome, {session?.user?.name}
                </h1>
                <div className="mx-10 flex flex-1 space-x-10 text-center">
                  <button
                    className="rounded-lg border border-gray-300 px-2"
                    onClick={openModal}
                  >
                    Bookmarked Officials
                  </button>
                  <button
                    className="rounded-lg border border-gray-300 px-2"
                    onClick={() => {
                      signOut({ callbackUrl: "https://productive.vote" });
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
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
                Your Votes
              </Tab>
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
                Your Representatives
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel className="h-full">
                {/* Saved Votes */}
                {data &&
                  data?.length > 0 &&
                  data?.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (legislation: any, k: React.Key | null | undefined) => {
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
                    }
                  )}
              </Tab.Panel>
              <Tab.Panel className="h-screen">
                {savedOfficials?.status === "success" &&
                savedOfficials.data?.length > 0 ? (
                  <div className="mt-4 space-y-2 overflow-y-scroll scrollbar-none">
                    {savedOfficials.data?.map((official, k) => (
                      <Official
                        key={k}
                        office={official.office as string}
                        official={official.name}
                        party={official.party}
                        channel={official.channel as string}
                        channelId={""}
                        url={official.url as string}
                        wikiUrl={""}
                        photoUrl={""}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 h-56 space-y-2 overflow-y-scroll scrollbar-none">
                    <div className="flex w-full items-center justify-between rounded-lg border border-gray-300 p-4">
                      No saved representatives
                    </div>
                  </div>
                )}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </section>
        {session && <SessionSidebar />}
      </main>
    </div>
  );
};

export default Profile;
