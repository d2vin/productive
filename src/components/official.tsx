import { BookmarkIcon, LinkIcon, UserIcon } from "@heroicons/react/solid";
import { BookmarkIcon as OutlinedBookmarkIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

type OfficialProps = {
  key: number;
  office: string;
  official: string;
  party: string;
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
  party,
  channel,
  channelId,
  url,
  wikiUrl,
  photoUrl,
}) => {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const saveOfficialMutation = trpc.official.saveOfficial.useMutation();
  const unsaveOfficialMutation = trpc.official.unsaveOfficial.useMutation();
  const handleSaveOfficialClick = async () => {
    if (isSaved) {
      setIsSaved(false);
      unsaveOfficialMutation.mutate({
        name: official,
        party: party,
      });
    } else {
      setIsSaved(true);
      saveOfficialMutation.mutate({
        userId: session?.user?.id as string,
        name: official,
        party: party,
        office: office,
        channel: channel,
        channelId: channelId,
        url: url,
        wikiUrl: wikiUrl,
      });
    }
  };
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
              await handleSaveOfficialClick();
            }}
          >
            {isSaved ? (
              <BookmarkIcon className="h-6 cursor-pointer transition-all duration-150 ease-out hover:scale-125" />
            ) : (
              <OutlinedBookmarkIcon className="h-6 cursor-pointer transition-all duration-150 ease-out hover:scale-125" />
            )}
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
