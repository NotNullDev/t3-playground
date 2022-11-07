import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const myRouter = router({
  getAll: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    console.dir(ctx);
    console.debug(input);
    return "Hello " + input + "!";
  }),
});
