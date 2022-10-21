import React from 'react';
import Image from 'next/image';
import {
  SearchIcon,
  UserGroupIcon,
  PaperAirplaneIcon,
  MenuIcon,
  HomeIcon,
} from '@heroicons/react/solid';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
// import { useRecoilState } from 'recoil';
// import { modalState } from '../atoms/modal-atom';

type HeaderProps = {
  message: string;
};

const Header: React.FC<HeaderProps> = ({ message }) => {
  const { data: session } = useSession();
  // const [open, setOpen] = useRecoilState(modalState);
  const router = useRouter();
  return (
    <div className="shadow-sm border-b sticky top-0 z-20 bg-white">
      <div className="flex justify-between items-center bg-white max-w-6xl mx-5 lg:mx-auto">
        {/* Left - Logo */}
        <div className="relative hidden lg:inline-grid cursor-pointer">
          <h1
            onClick={() => router.push('/')}
            className="text-2xl font-extralight"
          >
            {message}
          </h1>
        </div>
        <div
          onClick={() => router.push('/')}
          className="relative w-10 lg:hidden flex-shrink-0 cursor-pointer"
        >
          <Image src="/productive.png" alt="Logo" height={40} width={40} />
        </div>
        {/* Middle - Search Input */}
        <div className="max-w-xs">
          <div className="relative mt-1 p-3 rounded-md">
            <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="search"
              className="bg-gray-50 block w-full pl-10 sm:text-sm border-gray-300 focus:ring-black focus:border-black rounded-md"
            />
          </div>
        </div>
        {/* Right */}
        <div className="flex items-center justify-end space-x-4">
          <MenuIcon className="h-6 md:hidden cursor-pointer" />
          <HomeIcon onClick={() => router.push('/')} className="nav-btn" />
          {session ? (
            <>
              <div className="relative nav-btn">
                <PaperAirplaneIcon className="nav-btn rotate-45" />
                <div className="absolute -top-1 -right-2 text-xs w-5 h-5 bg-red-500 rounded-full flex justify-center items-center text-white">
                  2
                </div>
              </div>
              {/* <PlusCircleIcon
                onClick={() => setOpen(true)}
                className="nav-btn"
              /> */}
              <UserGroupIcon className="nav-btn" />
              {/* <HeartIcon className="nav-btn" /> */}
              <a
                className="flex items-center"
                onClick={() => {
                  // signOut();
                  router.push(`/profile/${session.user?.id}`)
                }}
              >
                <Image
                  src={
                    typeof session?.user?.image === 'string'
                      ? session?.user?.image
                      : '/productive.png'
                  }
                  height="36"
                  width="36"
                  alt="Profile"
                  className="h-10 rounded-full cursor-pointer"
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
