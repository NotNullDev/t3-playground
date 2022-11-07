import type { Example } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function ApiRouteDemo() {
  const [data, setData] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const add = async () => {
    const resp = await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({
        name: inputRef.current?.value ?? "",
      }),
    });

    if (resp.ok) {
      toast("ok");
    } else {
      toast("error!");
    }
  };

  const getAll = async () => {
    toast("hi!");
    const resp = await fetch("/api/messages");

    if (resp.ok) {
      toast("ok");
      const data = (await resp.json()) as Example[];
      console.log(data);
      setData((old) => [...old, ...data.map((d) => d.message)]);
    } else {
      toast("error!");
    }
  };

  useEffect(() => {
    (async function () {
      await getAll();
    })();
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex flex-col gap-3">
        <form key={data.length.toString()}>
          <input type="text" className="input-bordered input" ref={inputRef} />
          <button
            type="submit"
            className="btn-ghost btn"
            onClick={(e) => {
              e.preventDefault();
              console.log("hi!");
              add();
            }}
          >
            Add
          </button>
        </form>
        <div>data:</div>
        <div className="flex max-h-[50vh] flex-col gap-2 overflow-auto bg-base-200 p-4">
          {data.map((d, idx) => {
            return (
              <div className="rounded-xl bg-base-100 bg-base-300 p-4" key={idx}>
                {d}
              </div>
            );
          })}
        </div>
      </div>
      <div></div>
    </div>
  );
}
