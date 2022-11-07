import { type NextPage } from "next";
import { useEffect } from "react";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  useEffect(() => {
    const sse = new EventSource("http://localhost:3000/api/sse");

    sse.addEventListener("open", (data) => {
      console.log("sse event! ");
      console.dir(data);
    });

    sse.onerror = (e) => console.log("sse error!");
    sse.onopen = (e) => console.log("sse open!");

    return () => {
      sse.close();
    };
  }, []);

  return (
    <div className="mt-20 flex flex-1 justify-center">
      <input
        type="text"
        className="input-bordered input"
        placeholder="nickname"
      />
      <button className="btn-ghost btn">Save</button>
    </div>
  );
};

export default Home;
