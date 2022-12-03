import { BookmarkIcon, LinkIcon, UserIcon } from "@heroicons/react/solid";
import React from "react";
import { signIn, useSession } from "next-auth/react";

type OfficialProps = {
  key: number;
  office: string;
  official: string;
  channel: string;
  channelId: string;
  url: string;
  wikiUrl: string;
  photoUrl: string;
};

const Official: React.FC<OfficialProps> = ({
  key,
  office,
  official,
  channel,
  channelId,
  url,
  wikiUrl,
  photoUrl,
}) => {
  const { data: session } = useSession();
  return (
    <div
      key={key}
      className="flex w-full items-center justify-between rounded-lg border border-gray-300 p-4"
    >
      <div>
        {office}:<br />
        {official}
      </div>
      <div className="flex">
        <a target="_blank" href={url} rel="noreferrer">
          <LinkIcon className="h-6 cursor-pointer transition-all duration-150 ease-out hover:scale-125" />
        </a>
        {session ? (
          <button
            onClick={async () => {
              console.log("saving official");
              // await setOfficialIndex(office?.officialIndices[0] as number);
              // await handleSaveOfficialClick();
            }}
          >
            <BookmarkIcon className="h-6 cursor-pointer transition-all duration-150 ease-out hover:scale-125" />
          </button>
        ) : (
          <button onClick={() => signIn()}>
            <UserIcon className="h-6 cursor-pointer transition-all duration-150 ease-out hover:scale-125" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Official;
