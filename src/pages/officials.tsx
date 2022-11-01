import type { NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Header from "../components/header";
import MiniProfile from "../components/mini-profile";
import Suggestions from "../components/bookmarked-officials";
import OfficialsList from "../components/officials-list";
// import { BookmarkIcon } from "@heroicons/react/solid";

const Officials: NextPage = () => {
  const { data: session } = useSession();
  return (
    <div className="bg-gray-50-h-screen overflow-y-scroll scrollbar-hide">
      <Head>
        <title>Productive</title>
        <meta name="Members of Congress" content="Generated by Productive" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <div className="mb-16">
        <Header message={"Productive"} />
      </div>
      <main
        className={`mx-auto grid grid-cols-1 md:max-w-3xl md:grid-cols-2 xl:max-w-6xl xl:grid-cols-3 ${
          !session && "!max-w-3xl !grid-cols-1"
        }`}
      >
        {/* Section */}
        <section className="col-span-2 mx-2 lg:mx-0">
          {/* Stories */}
          <h1 className="mt-20 text-center text-4xl font-semibold sm:text-left">
            Your Public Officials
          </h1>
          {/* Posts */}
          <OfficialsList message="Senators" />
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
    </div>
  );
};

export default Officials;
