import { useState } from "react";
import { useGetTaskList, useDeleteTask, useUpdateTask } from "./queries";
import { CreateTaskForm } from "./CreateTaskForm";
import { EditTaskForm } from "./EditTaskForm";
import type { TaskStatus } from "./api";
import { StatusSelect } from "./components/StatusSelect";
import { StatusBadge } from "./components/StatusBadge";
import { DueDate } from "../shared/components/DueDate";

type SortBy = "dueDate" | "title" | "status";
type SortingOrder = "asc" | "desc";

export default function App() {
  const [status, setStatus] = useState<TaskStatus | undefined>(undefined);
  const [sort, setSort] = useState<SortBy>("dueDate");
  const [order, setOrder] = useState<SortingOrder>("asc");
  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: tasks = [], isLoading } = useGetTaskList({
    status,
    sort,
    order,
    from,
    to,
  });

  const deleteMutation = useDeleteTask();
  const toggleMutation = useUpdateTask();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Tasks</h1>

        {/* Controls */}
        <div className="flex flex-col gap-2 mb-4">
          <CreateTaskForm />

          <div className="flex gap-2">
            <StatusSelect
              value={status}
              onChange={setStatus}
              includeAll
              className="border rounded-lg px-2 py-1"
            />

            <input
              type="date"
              value={from ? from.split("T")[0] : ""}
              onChange={(e) =>
                setFrom(
                  e.target.value
                    ? new Date(e.target.value).toISOString()
                    : undefined,
                )
              }
              className="border rounded-lg px-2 py-1"
              placeholder="From"
            />

            <input
              type="date"
              value={to ? to.split("T")[0] : ""}
              onChange={(e) =>
                setTo(
                  e.target.value
                    ? new Date(e.target.value).toISOString()
                    : undefined,
                )
              }
              className="border rounded-lg px-2 py-1"
              placeholder="To"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="border rounded-lg px-2 py-1"
            >
              <option value="dueDate">Due Date</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
            </select>

            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as typeof order)}
              className="border rounded-lg px-2 py-1"
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="space-y-2">
          {tasks.map((t) => (
            <div key={t.id} className="border p-2 rounded">
              {editingId === t.id ? (
                <EditTaskForm task={t} onDone={() => setEditingId(null)} />
              ) : (
                <>
                  <div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={t.status} />
                      <span>{t.title}</span>
                      {t.dueDate ? (
                        <DueDate date={t.dueDate} />
                      ) : (
                        <span className="text-sm text-gray-400">
                          No due date
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => setEditingId(t.id)}
                      className="rounded-lg p-2 border-2 border-blue-400 text-blue-400 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg p-2 border-2 border-red-400 text-red-400 font-semibold"
                      onClick={() => deleteMutation.mutate(t.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <p className="text-center text-gray-400 mt-4">No tasks found</p>
        )}
      </div>
    </div>
  );
}
