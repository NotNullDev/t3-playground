import { toast } from "react-hot-toast";
import { trpc } from "../utils/trpc";

export default function TrpcDemo() {
  trpc.myrouter.getAll.useQuery("world", {
    onSuccess: (data) => {
      console.log("trpc success!");
      toast(data);
    },
    onError: () => {
      console.log("hmm... something went wrong with trpc!!");
    },
  });

  return <div>hello!</div>;
}
