import { useRouter } from "next/router";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import { useState, Fragment } from "react";
import usePlacesAutocomplete from "use-places-autocomplete";
import Header from "../components/header";
import { NextPage } from "next";
import Footer from "../components/footer";
import Head from "next/head";

const Landing: NextPage = () => {
  const [address, setAddress] = useState<string>();
  const router = useRouter();
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelect = async (address: string) => {
    setAddress(address);
    setValue(address, false);
    console.log(value);
    clearSuggestions();
  };

  return (
    <>
      <Header message="Productive" />
      <div className="flex h-screen items-center justify-center space-y-10 bg-gray-50 text-black">
        <div className="mx-8 max-w-2xl space-y-4 rounded-xl border border-gray-300 bg-white py-8 px-4">
          <div className="text-center text-5xl font-medium sm:text-left">
            <h1>
              <span className="bg-gradient-to-bl from-gray-400 to-gray-800 bg-clip-text text-transparent">
                Democracy
              </span>{" "}
              for the next generation 🗳️
            </h1>
          </div>
          <div className="text-center sm:text-left">
            Welcome to{" "}
            <strong className="bg-gradient-to-bl from-gray-400 to-gray-800 bg-clip-text text-transparent">
              Productive
            </strong>
            , an accessible resource for government data. Search via address or
            explore to find all relative representative and voter information
          </div>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <button
              className="w-full rounded-lg bg-gray-900 p-2 text-white focus:shadow hover:bg-gray-800"
              onClick={() => {
                router.push("/elections");
              }}
            >
              Search
            </button>
            <button
              className="w-full rounded-lg bg-gray-900 p-2 text-white focus:shadow hover:bg-gray-800"
              onClick={() => {
                router.push("/home");
              }}
            >
              Explore
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Landing;
