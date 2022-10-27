import React, { useState } from "react";
import Image from "next/image";
import {
  SearchIcon,
  UserGroupIcon,
  PaperAirplaneIcon,
  MenuIcon,
  HomeIcon,
} from "@heroicons/react/solid";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import { Senator } from "@prisma/client";

type HeaderProps = {
  message: string;
};

const Header: React.FC<HeaderProps> = ({ message }) => {
  const { data: session } = useSession();
  const { data } = trpc.example.getSenators.useQuery();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<Senator[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilter = (event: any) => {
    const searchWord = event.target.value;
    const newFilter = data?.filter((value) => {
      return value.firstName.toLowerCase().includes(searchWord.toLowerCase());
    });
    if (searchWord === "") {
      setFilteredData([]);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setFilteredData(newFilter!);
    }
  };

  return (
    <div className="fixed top-0 z-20 w-full border-b bg-white shadow-sm">
      <div className="mx-5 flex max-w-6xl items-center justify-between bg-white lg:mx-auto">
        {/* Left - Logo */}
        <div className="relative hidden cursor-pointer lg:inline-grid">
          <h1
            onClick={() => router.push("/")}
            className="text-2xl font-extralight"
          >
            {message}
          </h1>
        </div>
        <div
          onClick={() => router.push("/")}
          className="relative w-10 flex-shrink-0 cursor-pointer lg:hidden"
        >
          <Image src="/productive.png" alt="Logo" height={40} width={40} />
        </div>
        {/* Middle - Search Input */}
        <div className="max-w-xs">
          <div className="relative mt-1 rounded-md p-3">
            <div className="pointer-events-none absolute inset-y-0 flex items-center pl-3">
              <SearchIcon className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="search"
              onChange={handleFilter}
              className="block w-full rounded-md border-gray-300 bg-gray-50 pl-10 focus:border-black focus:ring-black sm:text-sm"
            />
          </div>
          {filteredData.length != 0 && (
            <div className="absolute mt-2 max-h-48 w-[230px] overflow-hidden overflow-y-auto rounded-lg border bg-white p-1">
              {filteredData?.map((value, k) => {
                return (
                  <div key={k}>
                    <a
                      href={`/senator/${value.id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="flex">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="h-8 w-8 transform cursor-pointer rounded-full border object-contain p-[2px] transition duration-200 ease-out hover:scale-110"
                          src={`https://theunitedstates.io/images/congress/225x275/${value.id}.jpg`}
                          alt="Logo"
                        />
                        <div className="ml-4 flex-1">
                          <h2 className="text-sm font-semibold">
                            {value.firstName} {value.lastName}
                          </h2>
                          <h3 className="text-xs text-gray-400">
                            Party: {value.party}
                          </h3>
                        </div>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
                  <Link href="/">
                    <a className="block rounded-lg py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      Home
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/elections">
                    <a
                      href="#"
                      className="block rounded-lg py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Elections
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/officials">
                    <a
                      href="#"
                      className="block rounded-lg py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Officials
                    </a>
                  </Link>
                </li>
                {session && (
                  <li>
                    <a
                      onClick={() => signOut()}
                      className="block rounded-lg py-2 px-4 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Sign out
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
          <HomeIcon onClick={() => router.push("/")} className="nav-btn" />
          <div className="nav-btn relative">
            <Link href="/elections">
              <PaperAirplaneIcon className="nav-btn rotate-45" />
            </Link>
            {/* <div className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  2
                </div> */}
          </div>
          <Link href="/officials">
            <UserGroupIcon className="nav-btn" />
          </Link>
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
            <button onClick={() => signIn()}>Sign In</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
