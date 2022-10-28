import { useSession } from "next-auth/react";
import React from "react";
import MiniProfile from "./mini-profile";
import Bills from "./bills";
import Stories from "./stories";
import Suggestions from "./suggestions";

const Feed: React.FC = () => {
  const { data: session } = useSession();
  return (
    <main
      className={`mx-auto grid grid-cols-1 md:max-w-3xl md:grid-cols-2 xl:max-w-6xl xl:grid-cols-3 ${
        !session && "!max-w-3xl !grid-cols-1"
      }`}
    >
      {/* Section */}
      <section className="col-span-2">
        {/* Stories */}
        <Stories message={"Stories"} />
        {/* Bills */}
        <Bills />
      </section>
      {/* Section */}
      {session && (
        <section className="hidden md:col-span-1 xl:inline-grid">
          <div className="fixed top-20">
            {/* Mini Profile */}
            <MiniProfile message={"Mini Profile"} />
            {/* Suggestions */}
            <Suggestions message={"Bookmarked Officials "} />
          </div>
        </section>
      )}
    </main>
  );
};

export default Feed;
