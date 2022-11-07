import type { Todo } from "@prisma/client";
import dayjs from "dayjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { trpc } from "../utils/trpc";

export default function TodoDemoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  trpc.todo.getAll.useQuery(undefined, {
    onSuccess: (data) => {
      toast("fetched " + data.length + " todos.");
    },
  });

  return (
    <div className="mt-10 flex flex-1 flex-col items-center gap-4">
      <div className="flex gap-2">
        <input type="text" className="input-bordered input" />
        <button className="btn-ghost btn">Add</button>
      </div>

      <div className="after:[content=''] mx-20 flex flex-wrap gap-5  after:flex-auto">
        {todos.map((t) => (
          <SingleTodo key={t.id} todo={t} />
        ))}
      </div>
    </div>
  );
}

type SingleTodoProps = {
  todo: Todo;
};

const SingleTodo = ({ todo }: SingleTodoProps) => {
  return (
    <div className="flex flex-wrap">
      <div className="flex h-[200px] w-[400px] gap-10 rounded-xl bg-base-300 p-10">
        <div className="flex w-full flex-col items-start justify-between gap-3">
          <div className="flex w-full">
            <div className="flex-1">{todo.content}</div>
            <div className="btn-ghost btn">X</div>
          </div>
          <div className="flex w-full items-center justify-between bg-base-200">
            <div className="flex gap-2">
              <input type="checkbox" className="checkbox" />
              <label className="select-none">DONE</label>
            </div>
            <div>Created at: {dayjs(todo.createdAt).format("DD.MM.YYYY")}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
