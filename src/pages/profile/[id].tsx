import { useSession } from "next-auth/react";
import React from "react";
import Header from "../../components/header";
import MiniProfile from "../../components/mini-profile";
import SavedVotes from "../../components/saved-votes";
import Suggestions from "../../components/bookmarked-officials";
import { trpc } from "../../utils/trpc";
import Image from "next/image";
import { useRouter } from "next/router";
import { Tab } from "@headlessui/react";
import Legislation from "../../components/legislation";
const Profile: React.FC = () => {
  const { data: session } = useSession();
  const { data, status } =
    trpc.legislation.getUserVotesOnSponsoredLegislation.useQuery({
      userId: session?.user?.id as string
    });
  const router = useRouter();
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>Loading...</p>;
  }
  return (
    <>
      <div className="mb-16">
        <Header message={"Productive"} />
      </div>
      <main
        className={`mx-auto grid grid-cols-1 md:max-w-3xl md:grid-cols-2 xl:max-w-6xl xl:grid-cols-3 ${
          !session && "!max-w-3xl !grid-cols-1"
        }`}
      >
        {/* Section */}
        <section className="col-span-2 mx-2 space-y-8 lg:mx-0">
          <div className="mt-8 flex-col justify-center space-y-12 rounded-sm border border-gray-200 bg-white p-6 align-middle">
            <>
              <div className="flex items-center">
                <a
                  className="flex items-center"
                  onClick={() => {
                    router.push(`/profile/${session?.user?.id}`);
                  }}
                >
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
                </a>
                <div className="flex flex-1 justify-center">
                  <div className="mx-10 flex flex-1 space-x-10 text-center">
                    <button className="rounded-lg border border-gray-300 px-2">
                      Bookmarked Senators
                    </button>
                    <button className="rounded-lg border border-gray-300 px-2">
                      Bookmarked Representatives
                    </button>
                  </div>
                </div>
              </div>
            </>
          </div>
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
                Your Votes
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
                Elections
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel
                className={classNames(
                  "rounded-xl bg-white p-3",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                )}
              >
                {/* Saved Votes */}
                {data.length > 0 && data
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ?.map((legislation: any, k: React.Key | null | undefined) => {
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
                  }
              </Tab.Panel>
              <Tab.Panel
                className={classNames(
                  "rounded-xl bg-white p-3",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                )}
              >
                Elections
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </section>
        {/* Section */}
        {session && (
          <section className="hidden md:col-span-1 xl:inline-grid">
            <div className="fixed top-20">
              {/* Mini Profile */}
              <MiniProfile />
              {/* Suggestions */}
              <Suggestions message={"Bookmarked Officials "} />
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default Profile;
