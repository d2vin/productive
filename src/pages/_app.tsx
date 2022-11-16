// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  // const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string;
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      {/* <script
        async
        defer
        src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`}
      /> */}
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
