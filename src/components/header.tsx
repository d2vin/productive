import React, { useState } from "react";
import Image from "next/image";
import {
  SearchIcon,
  UserIcon,
  BookmarkIcon,
  MenuIcon,
  HomeIcon,
} from "@heroicons/react/solid";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

type HeaderProps = {
  message: string;
};

const Header: React.FC<HeaderProps> = ({ message }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [address, setAddress] = useState<string>("");
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (e: any) => {
    e.preventDefault();
    router.push(`/results/${address}`);
  };

  return (
    <div className="fixed top-0 z-20 w-full border-b bg-white shadow-sm">
      <div className="mx-5 flex max-w-5xl items-center justify-between bg-white lg:mx-auto">
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
        <form onSubmit={onSubmit}>
          {/* Middle - Search Input */}
          <div className="max-w-xs">
            <div className="relative mt-1 rounded-md p-3">
              <div className="pointer-events-none absolute inset-y-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="block w-full rounded-md border-gray-300 bg-gray-50 pl-10 focus:border-black focus:ring-black sm:text-sm"
              />
            </div>
          </div>
        </form>
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
                  <Link href="/polling">
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
            <Link href="/polling">
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
