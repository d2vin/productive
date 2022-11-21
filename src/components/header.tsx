import React, { useState } from "react";
import Image from "next/image";
import {
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
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-0 z-20 w-full border-b bg-white shadow-sm">
      <div className="mx-5 flex h-16 max-w-7xl items-center justify-between bg-white lg:mx-auto">
        {/* Left - Logo */}
        <div className="relative hidden cursor-pointer lg:inline-grid ">
          <h1
            onClick={() => router.push("/")}
            className="ml-8 text-2xl font-extralight"
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
        {/* Right */}
        <div className="flex items-center justify-end space-x-4 lg:mr-8">
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
