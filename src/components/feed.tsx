import { useSession } from "next-auth/react";
import React from "react";
import Stories from "./stories";
import { Tab } from "@headlessui/react";
import SenatorLegislation from "./senator-legislation";
import RepresentativeLegislation from "./representative-legislation";
import SessionSidebar from "./session-sidebar";

const Feed: React.FC = () => {
  const { data: session } = useSession();
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <main
      className={`mx-auto grid grid-cols-1 md:max-w-3xl md:grid-cols-2 xl:max-w-6xl xl:grid-cols-3 ${
        !session && "!max-w-3xl !grid-cols-1"
      }`}
    >
      {/* Section */}
      <section className="col-span-2 mx-2 space-y-8 lg:mx-0">
        {/* Stories */}
        <Stories />
        {/* Tab Group */}
        <Tab.Group>
          {/* Tab List */}
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
              Senate Legislation
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
              House Legislation
            </Tab>
          </Tab.List>
          {/* Tab Content */}
          <Tab.Panels>
            <Tab.Panel>
              <SenatorLegislation />
            </Tab.Panel>
            <Tab.Panel>
              <RepresentativeLegislation />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </section>
      {/* Section */}
      {session && <SessionSidebar />}
    </main>
  );
};

export default Feed;
