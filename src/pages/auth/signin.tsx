import { GetServerSideProps, NextPage } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
  useSession,
} from "next-auth/react";
import React from "react";
import Header from "../../components/header";

type SignInProps = {
  providers: Promise<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>;
};

// Browser...
const SignIn: NextPage<SignInProps> = ({ providers }) => {
  const { data: session } = useSession();
  return (
    <>
      <Header message={"Productive"} />
      <div className="flex min-h-screen flex-col items-center justify-center space-y-8 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="mt-6 w-36" src="/productive.png" alt="Logo" />
        <p className="font-xs italic">
          Sign in to stay up to date with upcoming
          <br />
          votes by elected officials
        </p>
        <div className="pb-40">
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="rounded-lg bg-blue-500 p-3 text-white"
                onClick={() =>
                  signIn(provider.id, {
                    callbackUrl: "https://productive-z4up.vercel.app",
                  })
                }
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// Server side render...
// Export the `session` prop to use sessions with Server Side Rendering
export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
};

export default SignIn;
