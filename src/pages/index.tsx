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
            Welcome to <strong>Productive</strong>, an accessible resource for
            government data. Enter an address or explore to find all relative
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
                address ? router.push(`results/${address}`) : router.push("/home");
              }}
            >
              Explore
            </button>
          </div>
        </div>
      </div>
      <footer className="bg-gray-50 p-4 md:px-6 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a href="https://productive.vote" className="mb-4 flex items-center sm:mb-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/productive.png"
              className="mr-3 h-8"
              alt="Productive Logo"
            />
            <span className="self-center whitespace-nowrap text-2xl font-semibold">
              Productive
            </span>
          </a>
          <ul className="mb-6 flex flex-wrap items-center text-sm text-gray-500 sm:mb-0">
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                About
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-500 dark:text-gray-400 sm:text-center">
          © 2022{" "}
          <a href="https://productive.vote/" className="hover:underline">
            Productive™
          </a>
          . All Rights Reserved.
        </span>
      </footer>
    </>
  );
};

export default Landing;
