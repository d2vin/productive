import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/header";
import Feed from "../components/feed";

const Home: NextPage = () => {
  return (
    <>
      <div className="h-screen overflow-y-scroll bg-gray-50 scrollbar-hide">
        <Head>
          <title>Productive</title>
          <meta name="Productive" content="Generated by Productive" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* Header */}
        <div className="mb-16">
          <Header message={"Productive"} />
        </div>

        {/* Feed */}
        <Feed />
      </div>
    </>
  );
};

export default Home;
