import { NextPage } from "next";
import { useSession } from "next-auth/react";
import React from "react";
import Header from "../components/header";
import MiniProfile from "../components/mini-profile";
import Poll from "../components/poll";
import BookmarkedOfficials from "../components/bookmarked-officials";

const Polling: NextPage = () => {
  const { data: session } = useSession();

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
            <h1 className="mt-20 text-center text-4xl font-semibold sm:text-left">
              Your Polling Location
            </h1>
            <Poll />
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

export default Polling;
