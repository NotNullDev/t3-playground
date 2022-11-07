import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { trpc } from "../utils/trpc";

import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className="flex h-screen w-screen flex-1 flex-col">
        <Toaster />
        <Header />
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
};

const Header = () => {
  const router = useRouter();
  return (
    <div className="p-4 ">
      <button className="btn-ghost btn" onClick={() => router.push("/")}>
        Home
      </button>
      <button
        className="btn-ghost btn"
        onClick={() => router.push("/apiroutes")}
      >
        routes demo
      </button>
      <button
        className="btn-ghost btn"
        onClick={() => router.push("/trpcdemo")}
      >
        trpc demo
      </button>
      <button
        className="btn-ghost btn"
        onClick={() => router.push("/todo-demo")}
      >
        todo demo
      </button>
    </div>
  );
};

export default trpc.withTRPC(MyApp);
