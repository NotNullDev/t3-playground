import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { Todo } from "@prisma/client";
import dayjs from "dayjs";
import { useId, useRef, useState } from "react";
import toast from "react-hot-toast";
import { trpc } from "../utils/trpc";

export default function TodoDemoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [parent] = useAutoAnimate<HTMLDivElement>();

  trpc.todo.getAll.useQuery(undefined, {
    onSuccess: (data) => {
      toast("fetched " + data.length + " todos.");
      setTodos(data);
    },
  });
  const addTodoMutation = trpc.todo.add.useMutation();
  const deleteTodoMutation = trpc.todo.removeTodo.useMutation();
  const context = trpc.useContext();

  const removeTodo = (todoId: string) => {
    deleteTodoMutation.mutate(todoId, {
      onSettled: () => {
        context.todo.getAll.invalidate();
      },
      onError: () => {
        toast("failed to remove todo");
      },
      onSuccess: () => {
        toast("todo removed");
      },
    });
  };

  const createTodo = () => {
    if (!inputRef.current) {
      toast("error! input ref not defined");
      return;
    }

    if (inputRef.current.value.trim() === "") {
      toast("todo content cannot be empty!");
      return;
    }

    addTodoMutation.mutate(inputRef.current?.value, {
      onSettled: () => {
        context.todo.getAll.invalidate();
      },
      onError: (err) => {
        toast("failed to create todo!");
      },
      onSuccess: (data) => {
        toast("created todo.");
      },
    });
  };

  return (
    <div className="mt-10 flex flex-1 flex-col items-center gap-4">
      <div className="flex gap-2">
        <input
          type="text"
          className="input-bordered input"
          ref={inputRef}
          key={todos.length.toString()}
        />
        <button className="btn-ghost btn" onClick={() => createTodo()}>
          Add
        </button>
      </div>

      <div
        className="after:[content=''] mx-20 flex flex-wrap gap-5  after:flex-auto"
        ref={parent}
      >
        {todos.map((t) => (
          <SingleTodo key={t.id} todo={t} deleteTodo={removeTodo} />
        ))}
      </div>
    </div>
  );
}

type SingleTodoProps = {
  todo: Todo;
  deleteTodo: (todoId: string) => void;
};

const SingleTodo = ({ todo, deleteTodo }: SingleTodoProps) => {
  const todoStatusMutation = trpc.todo.toggleStatus.useMutation();
  const context = trpc.useContext();
  const id = useId();
  return (
    <div className="flex flex-wrap">
      <div className="flex h-[200px] w-[400px] gap-10 rounded-xl bg-base-300 p-10">
        <div className="flex w-full flex-col items-start justify-between gap-3">
          <div className="flex w-full">
            <div className="flex-1">{todo.content}</div>
            <div className="btn-ghost btn" onClick={() => deleteTodo(todo.id)}>
              X
            </div>
          </div>
          <div className="flex w-full items-center justify-between ">
            <div className="flex gap-2">
              <input
                id={id}
                type="checkbox"
                className="checkbox"
                checked={todo.status !== "not_done"}
                onClick={() =>
                  todoStatusMutation.mutate(
                    {
                      id: todo.id,
                      newStatus:
                        todo.status === "not_done" ? "done" : "not_done",
                    },
                    {
                      onSettled: () => context.todo.getAll.invalidate(),
                    }
                  )
                }
              />
              <label className="select-none" htmlFor={id}>
                {todo.status === "not_done" ? "not done" : "done"}
              </label>
            </div>
            <div>
              Created at: {dayjs(todo.createdAt).format("DD.MM.YYYY HH:mm")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
