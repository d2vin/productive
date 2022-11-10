import React, { Fragment, useState } from "react";
import Image from "next/image";
import {
  SearchIcon,
  UserIcon,
  BookmarkIcon,
  MenuIcon,
  HomeIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/solid";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Combobox, Transition } from "@headlessui/react";
import usePlacesAutocomplete from "use-places-autocomplete";

type HeaderProps = {
  message: string;
};

const Header: React.FC<HeaderProps> = ({ message }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [address, setAddress] = useState<string>("");
  const [open, setOpen] = useState(false);

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (e: any) => {
    e.preventDefault();
    router.push(`/elections/${address}`);
  };

  return (
    <div className="fixed top-0 z-20 w-full border-b bg-white shadow-sm">
      <div className="mx-5 flex max-w-5xl items-center justify-between bg-white lg:mx-auto h-16">
        {/* Left - Logo */}
        <div className="relative hidden cursor-pointer lg:inline-grid ">
          <h1
            onClick={() => router.push("/")}
            className="text-2xl font-extralight"
          >
            {message}
          </h1>
        </div>
        <div
          onClick={() => router.push("/")}
          className="relative top-1 w-10 flex-shrink-0 cursor-pointer lg:hidden"
        >
          <Image src="/productive.png" alt="Logo" height={40} width={40} />
        </div>
          {/* Middle - Search Input */}
        {/* <form onSubmit={onSubmit}>
          <div className="max-w-xs">
            <div className="relative rounded-md p-3">
              <div className="w-full">
                <Combobox value={address} onChange={handleSelect}>
                  <div className="relative">
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
                                          active
                                            ? "text-white"
                                            : "text-teal-600"
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
            </div>
          </div>
        </form> */}
        {/* Right */}
        <div className="flex items-center justify-end space-x-4">
          <MenuIcon
            className="h-6 cursor-pointer md:hidden"
            onClick={() => setOpen(!open)}
          />
          {open && (
            <div className="absolute top-14 right-9 z-20 rounded-lg border bg-white md:hidden">
              <ul className="text-sm text-gray-700">
                <li>
                  <Link href="/home">
                    <a
                      className={`block rounded-t-lg py-2 px-4 hover:bg-gray-300 hover:text-black`}
                    >
                      Home
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/elections">
                    <a
                      href="#"
                      className={`block py-2 px-4 hover:bg-gray-300 hover:text-black`}
                    >
                      Elections
                    </a>
                  </Link>
                </li>
                {session ? (
                  <li>
                    <a
                      onClick={() =>
                        signOut({ callbackUrl: "https://productive.vote" })
                      }
                      className="block rounded-b-lg py-2 px-4 hover:cursor-pointer hover:bg-gray-300 hover:text-black"
                    >
                      Sign out
                    </a>
                  </li>
                ) : (
                  <li>
                    <a
                      onClick={() => signIn()}
                      className="block rounded-b-lg py-2 px-4 hover:cursor-pointer hover:bg-gray-300 hover:text-black"
                    >
                      Sign in
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
          <HomeIcon onClick={() => router.push("/home")} className="nav-btn" />
          <div className="nav-btn relative">
            <Link href="/elections">
              <BookmarkIcon className="nav-btn" />
            </Link>
            {/* <div className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  2
                </div> */}
          </div>
          {/* <Link href="/officials">
            <UserGroupIcon className="nav-btn" />
          </Link> */}
          {session ? (
            <>
              <a
                className="flex items-center"
                onClick={() => {
                  router.push(`/profile/${session.user?.id}`);
                }}
              >
                <Image
                  src={
                    typeof session?.user?.image === "string"
                      ? session?.user?.image
                      : "/productive.png"
                  }
                  height="36"
                  width="36"
                  alt="Profile"
                  className="h-10 cursor-pointer rounded-full"
                />
              </a>
            </>
          ) : (
            <button onClick={() => signIn()}>
              <UserIcon className="nav-btn" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
