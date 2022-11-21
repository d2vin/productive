import React from "react";
import BookmarkedOfficials from "./bookmarked-officials";
import MiniProfile from "./mini-profile";

const SessionSidebar = () => {
  return (
    <section className="hidden md:col-span-1 xl:inline-grid">
      <div className="fixed top-20">
        {/* Mini Profile */}
        <MiniProfile />
        {/* Suggestions */}
        <BookmarkedOfficials message={"Bookmarked Officials "} />
      </div>
    </section>
  );
};

export default SessionSidebar;
