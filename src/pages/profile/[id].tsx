import { useSession } from "next-auth/react";
import React from "react";
import Header from "../../components/header";
import MiniProfile from "../../components/mini-profile";
import SavedPosts from "../../components/saved-posts";
import Suggestions from "../../components/suggestions";
import { trpc } from "../../utils/trpc";

type ProfileProps = {
  message: string;
};

const Profile: React.FC<ProfileProps> = ({}) => {
  const { data: session } = useSession();
  const { status } = trpc.auth.getSession.useQuery();
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>Loading...</p>;
  }
  return (
    <>
      <div className="mb-16">
        <Header message={"Productive"} />
      </div>
      <main
        className={`mx-auto grid grid-cols-1 md:max-w-3xl md:grid-cols-2 xl:max-w-6xl xl:grid-cols-3 ${
          !session && "!max-w-3xl !grid-cols-1"
        }`}
      >
        {/* Section */}
        <section className="col-span-2">
          <h1 className="mt-20 text-4xl font-semibold">Your Saved Votes</h1>
          {/* Posts */}
          <SavedPosts message={"Posts"} />
        </section>
        {/* Section */}
        {/* Mini Profile */}
        {/* Suggestions */}
        {session && (
          <section className="hidden md:col-span-1 xl:inline-grid">
            <div className="fixed top-20">
              <MiniProfile message={"Mini Profile"} />
              <Suggestions message={"Bookmarked Officials "} />
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default Profile;
