import { z } from "zod";
import { prisma } from "../../db/client";
import { publicProcedure, router } from "../trpc";

export const todoRouter = router({
  add: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    await prisma.todo.create({
      data: {
        content: input,
        status: "not_done",
      },
      select: null,
    });
  }),
  getAll: publicProcedure.query(async () => {
    const all = await prisma.todo.findMany();
    return all;
  }),
  removeTodo: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const foundTodo = await prisma.todo.delete({
      where: {
        id: input,
      },
      select: null,
    });
  }),
  toggleStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        newStatus: z.string(),
      })
    )
    .mutation(async ({ input: { id, newStatus } }) => {
      const updated = await prisma.todo.update({
        where: {
          id,
        },
        data: { status: newStatus },
      });
      return updated;
    }),
});
