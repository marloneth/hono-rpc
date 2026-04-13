import { useState } from "react";
import { useGetTaskList, useDeleteTask, useUpdateTask } from "./queries";
import { CreateTaskForm } from "./CreateTaskForm";
import { EditTaskForm } from "./EditTaskForm";
import type { TaskStatus } from "./api";
import { StatusSelect } from "./components/StatusSelect";
import { StatusBadge } from "./components/StatusBadge";
import { DueDate } from "../shared/components/DueDate";
import { AssigneeSelect } from "./components/AssigneeSelect";
import { useGetMemberList } from "../members/queries";

type SortBy = "dueDate" | "title" | "status";
type SortingOrder = "asc" | "desc";

export default function App() {
  const [status, setStatus] = useState<TaskStatus | undefined>(undefined);
  const [ownerId, setOwnerId] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<SortBy>("dueDate");
  const [order, setOrder] = useState<SortingOrder>("asc");
  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: members = [] } = useGetMemberList();
  const { data: tasks = [], isLoading } = useGetTaskList({
    status,
    ownerId,
    sort,
    order,
    from,
    to,
  });

  const deleteMutation = useDeleteTask();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Tasks</h1>

        {/* Controls */}
        <div className="flex flex-col gap-3 mb-6">
          <CreateTaskForm />

          {/* Filters */}
          <div className="border rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Filters
            </p>
            <div className="grid grid-cols-2 gap-2">
              <StatusSelect
                value={status}
                onChange={setStatus}
                includeAll
                className="border rounded-lg px-2 py-1 w-full"
              />

              <select
                value={ownerId ?? ""}
                onChange={(e) => setOwnerId(e.target.value || undefined)}
                className="border rounded-lg px-2 py-1 w-full"
              >
                <option value="">All members</option>
                <option value="unassigned">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.firstName} {m.lastName}
                  </option>
                ))}
              </select>

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
                className="border rounded-lg px-2 py-1 w-full"
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
                className="border rounded-lg px-2 py-1 w-full"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="border rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Sort
            </p>
            <div className="flex gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="border rounded-lg px-2 py-1 flex-1"
              >
                <option value="dueDate">Due Date</option>
                <option value="title">Title</option>
                <option value="status">Status</option>
              </select>

              <select
                value={order}
                onChange={(e) => setOrder(e.target.value as typeof order)}
                className="border rounded-lg px-2 py-1 flex-1"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
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
                    <div className="mt-2">
                      <AssigneeSelect taskId={t.id} ownerId={t.ownerId} />
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
