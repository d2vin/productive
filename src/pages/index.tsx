import { useRouter } from "next/router";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import { useState, Fragment } from "react";
import usePlacesAutocomplete from "use-places-autocomplete";
import Header from "../components/header";
import { NextPage } from "next";

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
          <div className="text-center text-6xl font-medium sm:text-left">
            <h1>
              Democracy for
              the next generation 🏛️
            </h1>
          </div>
          <div className="text-center sm:text-left">
            Welcome to <strong>Productive</strong>, an accessible resource for
            government data. Enter an address or explore to find all relative
            representative and voter information
          </div>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="w-full">
              <Combobox value={address} onChange={handleSelect}>
                <div className="relative mt-1">
                  <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                    <Combobox.Input
                      className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                      placeholder="address"
                      onChange={(event) => setValue(event.target.value)}
                      value={value}
                      disabled={!ready}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>
                  </div>
                  {value && status === "OK" && (
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                      afterLeave={() => setValue("")}
                    >
                      <Combobox.Options className="absolute mt-2 max-h-60 w-64 overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {status === "OK" &&
                          data.map(({ place_id, description }) => (
                            <Combobox.Option
                              key={place_id}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active
                                    ? "bg-gray-300 text-black"
                                    : "text-gray-900"
                                }`
                              }
                              value={description}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-medium" : "font-normal"
                                    }`}
                                  >
                                    {description}
                                  </span>
                                  {selected ? (
                                    <span
                                      className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                        active ? "text-white" : "text-teal-600"
                                      }`}
                                    >
                                      <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Combobox.Option>
                          ))}
                      </Combobox.Options>
                    </Transition>
                  )}
                </div>
              </Combobox>
            </div>
            <button
              className="w-full rounded-lg bg-black p-2 text-white focus:shadow hover:text-gray-200"
              onClick={() => {
                console.log("value", value);
                address
                  ? router.push(`results/${address}`)
                  : router.push("/home");
              }}
            >
              Explore
            </button>
          </div>
        </div>
      </div>
      <footer className="bg-gray-50 p-4 md:px-6 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="https://productive.vote"
            className="mb-4 flex items-center sm:mb-0"
          >
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
