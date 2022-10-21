import { useSession } from 'next-auth/react';
import React from 'react';
import MiniProfile from './mini-profile';
import Posts from './posts';
import Stories from './stories';
import Suggestions from './suggestions';

type FeedProps = {
  message: string;
};

const Feed: React.FC<FeedProps> = ({ message }) => {
  const { data: session } = useSession();
  return (
    <main className={`grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto ${!session && "!grid-cols-1 !max-w-3xl"}`}>
      {/* Section */}
      <section className="col-span-2">
        {/* Stories */}
        <Stories message={'Stories'} />
        {/* Posts */}
        <Posts message={'Posts'} />
      </section>
      {/* Section */}
      {/* Mini Profile */}
      {/* Suggestions */}
      {session && (
        <section className="hidden xl:inline-grid md:col-span-1">
          <div className="fixed top-20">
            <MiniProfile message={'Mini Profile'} />
            <Suggestions message={'Bookmarked Officials '} />
          </div>
        </section>
      )}
    </main>
  );
};

export default Feed;
