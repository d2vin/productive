import { useRouter } from "next/router";
import Header from "../components/header";
import { NextPage } from "next";
import Footer from "../components/footer";

const Landing: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <Header message="Productive" />
      <div className="flex h-screen items-center justify-center space-y-10 bg-gray-50 text-black">
        <div className="mx-8 max-w-2xl space-y-4 rounded-xl border border-gray-300 bg-white py-8 px-4">
          <div className="text-center text-5xl font-medium sm:text-left">
            <h1>
              <span className="bg-gradient-to-bl from-gray-400 to-gray-800 bg-clip-text text-transparent">
                Democracy
              </span>{" "}
              for the next generation 🗳️
            </h1>
          </div>
          <div className="text-center sm:text-left">
            Welcome to <strong>Productive</strong>, an accessible resource for
            government data. Search via address or explore to find all relative
            representative and voter information
          </div>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <button
              className="w-full rounded-lg bg-slate-900 p-2 text-white focus:shadow hover:bg-slate-800"
              onClick={() => {
                router.push("/elections");
              }}
            >
              Search
            </button>
            <button
              className="w-full rounded-lg bg-slate-900 p-2 text-white focus:shadow hover:bg-slate-800"
              onClick={() => {
                router.push("/home");
              }}
            >
              Explore
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Landing;
