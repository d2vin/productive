import { NextPage } from "next";
import React, { useState } from "react";
import Header from "../components/header";
import { useRouter } from "next/router";

const Landing: NextPage = () => {
  const [address, setAddress] = useState<string>();
  const router = useRouter();
  return (
    <>
      <Header message="Productive" />
      <div className="flex h-screen items-center justify-center space-y-10 bg-gray-50 text-black">
        <div className="mx-8 max-w-2xl space-y-4 rounded-xl border border-gray-300 bg-white py-8 px-4">
          <div className="text-center text-6xl font-medium sm:text-left">
            <h1>Democracy for the next generation</h1>
          </div>
          <div className="text-center sm:text-left">
            Welcome to <strong>Productive</strong>, an accessible resource for government data. Enter an address or explore to find all relative
            representative and voter information
          </div>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <input
              className="w-full rounded-lg border border-gray-300 p-2"
              placeholder="address"
              onChange={(e) => setAddress(e.target.value)}
            />
            <button
              className="w-full rounded-lg bg-black p-2 text-gray-300"
              onClick={() => {
                address ? router.push(`results/${address}`) : router.push("/");
              }}
            >
              Explore
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
