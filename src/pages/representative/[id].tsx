import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import { useRouter } from "next/router";
import Image from "next/image";
import { trpc } from "../../utils/trpc";
import Sponsored from "../../components/sponsored";
import SocialAccount from "../../components/social-account";
import { useSession } from "next-auth/react";

const OfficialProfile: React.FC = () => {
  const [bookmarked, setBookmarked] = useState<boolean>();
  const { data: session } = useSession();
  const router = useRouter();
  const query = router.query;
  const { data, status } = trpc.representative.getRepresentative.useQuery({
    bioguideId: query.id as string,
  });
  const isBookmarked = trpc.representative.isBookmarkedRepresentative.useQuery({
    representativeId: data?.id as number,
  });
  // mutations
  const bookmarkMutation =
    trpc.representative.bookmarkRepresentative.useMutation();
  const unbookmarkMutation =
    trpc.representative.unbookmarkRepresentative.useMutation();

  useEffect(() => {
    setBookmarked(isBookmarked.data);
  }, [isBookmarked.data]);

  if (status === "loading") {
    return (
      <div className="mb-16">
        <Header message="Productive" />
      </div>
    );
  }

  if (status === "error") {
    return <p>Error...</p>;
  }

  return (
    <>
      <div className="mb-16">
        <Header message="Productive" />
      </div>
      <main
        className={`mx-auto grid grid-cols-1 md:max-w-3xl md:grid-cols-2 xl:max-w-6xl xl:grid-cols-3 ${"!max-w-3xl !grid-cols-1"}`}
      >
        {/* Section */}
        <section className="col-span-2 mx-2 lg:mx-0">
          <div className="mt-20 text-center sm:text-left">
            <div className="flex flex-col">
              <div>
                <Image
                  src={`https://theunitedstates.io/images/congress/225x275/${query.id}.jpg`}
                  alt="Profile"
                  height={110}
                  width={90}
                  className="rounded-md"
                />
              </div>
              <div>
                <h1 className="text-lg font-semibold">
                  {data?.shortTitle} {data?.firstName} {data?.lastName}
                </h1>
              </div>
            </div>
            {/* Profile Buttons */}
            <div className="mt-2 flex flex-col space-y-2">
              <div className="flex w-full space-x-2 text-lg text-gray-400">
                <span className="flex-1 rounded-lg border border-gray-200 p-1 text-center">
                  State: {data?.state}
                </span>
                <span className="flex-1 rounded-lg border border-gray-200 p-1 text-center">
                  Party: {data?.party}
                </span>
              </div>
              <div className="flex w-full space-x-2 text-lg text-gray-400">
                <span className="flex-1 rounded-lg border border-gray-200 p-1 text-center">
                  {data?.title}
                </span>
                <span className="flex-1 rounded-lg border border-gray-200 p-1 text-center">
                  Next election: {data?.nextElection}
                </span>
              </div>
              <button className="rounded-lg border p-2 text-xs hover:bg-gray-300">
                {isBookmarked.status === "loading" && "..."}
                {isBookmarked.status === "success" &&
                  bookmarked &&
                  "Unbookmark"}
                {isBookmarked.status === "success" && !bookmarked && "Bookmark"}
              </button>
              <div className="itmes-center flex justify-between space-x-2">
                {data?.twitterAccount && (
                  <SocialAccount
                    platform="twitter"
                    account={data?.twitterAccount}
                  />
                )}
                {data?.youtubeAccount && (
                  <SocialAccount
                    platform="youtube"
                    account={data?.youtubeAccount}
                  />
                )}
                {data?.facebookAccount && (
                  <SocialAccount
                    platform="facebook"
                    account={data?.facebookAccount}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
        {/* Section */}
        <section className="mx-2 lg:mx-0">
          <Sponsored id={query.id as string} />
        </section>
      </main>
    </>
  );
};

export default OfficialProfile;
