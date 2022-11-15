import React from "react";
import Header from "../../components/header";
import { useRouter } from "next/router";
import Image from "next/image";
import { trpc } from "../../utils/trpc";
import Link from "next/link";
import Sponsored from "../../components/sponsored";

const OfficialProfile: React.FC = () => {
  const router = useRouter();
  const query = router.query;
  const { data, status } = trpc.senator.getSenator.useQuery({
    bioguideId: query.id as string,
  });

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
          <div className="mt-20 text-4xl font-semibold">
            <div className="flex items-center justify-between">
              <div className="ml-12">
                <Image
                  src={`https://theunitedstates.io/images/congress/225x275/${query.id}.jpg`}
                  alt="Profile"
                  height={110}
                  width={90}
                  className="rounded-md"
                />
              </div>
              <div className="ml-16 flex-1 space-y-3">
                <h1>
                  {data?.shortTitle} {data?.firstName} {data?.lastName}
                </h1>
              </div>
            </div>

            <div className="mx-2 mt-8 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <div className="space-x-2 text-lg text-gray-400">
                <span className="rounded-lg border border-gray-200 p-1">
                  State: {data?.state}
                </span>
                <span className="rounded-lg border border-gray-200 p-1">
                  Party: {data?.party}
                </span>
              </div>
              <div className="space-x-2 text-lg text-gray-400">
                <span className="rounded-lg border border-gray-200 p-1">
                  {data?.title}
                </span>
              </div>
              <div className="space-x-2 text-lg text-gray-400">
                <span className="rounded-lg border border-gray-200 p-1">
                  Next election: {data?.nextElection}
                </span>
              </div>
              <div>
                {data?.twitterAccount && (
                  <Link href={`https://twitter.com/${data?.twitterAccount}`}>
                    <a target="_blank">
                      <Image
                        src="/twitter.png"
                        alt="Twitter"
                        height={32}
                        width={32}
                      />
                    </a>
                  </Link>
                )}
                {data?.youtubeAccount && (
                  <Link href={`https://youtube.com/${data?.youtubeAccount}`}>
                    <a target="_blank">
                      <Image
                        src="/youtube.png"
                        alt="Youtube"
                        height={32}
                        width={32}
                      />
                    </a>
                  </Link>
                )}
                {data?.facebookAccount && (
                  <Link href={`https://facebook.com/${data?.facebookAccount}`}>
                    <a target="_blank">
                      <Image
                        src="/facebook.png"
                        alt="Facebook"
                        height={32}
                        width={32}
                      />
                    </a>
                  </Link>
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
