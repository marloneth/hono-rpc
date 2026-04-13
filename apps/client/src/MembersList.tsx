import { useState } from "react";
import { useDebounce } from "./hooks/useDebounce";
import { useGetMemberList, useDeleteMember } from "./queries/members";
import { CreateMemberForm } from "./CreateMemberForm";
import { EditMemberForm } from "./EditMemberForm";
import { RoleSelect } from "./components/RoleSelect";
import { MemberAvatar } from "./components/MemberAvatar";
import { RoleBadge } from "./components/RoleBadge";
import type { MemberRole } from "./api/members";

export function MembersList() {
  const [roleFilter, setRoleFilter] = useState<MemberRole | undefined>(undefined);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: members = [], isLoading } = useGetMemberList({
    role: roleFilter,
    search: debouncedSearch || undefined,
  });

  const deleteMutation = useDeleteMember();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Members</h1>

        <CreateMemberForm />

        <div className="flex gap-2 mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or username"
            className="border rounded-lg px-2 py-1 flex-1"
          />

          <RoleSelect
            value={roleFilter}
            onChange={setRoleFilter}
            includeAll
            className="border rounded-lg px-2 py-1"
          />
        </div>

        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.id} className="border p-2 rounded">
              {editingId === m.id ? (
                <EditMemberForm member={m} onDone={() => setEditingId(null)} />
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <MemberAvatar id={m.id} firstName={m.firstName} lastName={m.lastName} />
                    <div>
                      <div className="font-medium">
                        {m.firstName} {m.lastName}
                        <span className="ml-2 text-sm text-gray-500">@{m.userName}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm text-gray-500">{m.email}</span>
                        <RoleBadge role={m.role} />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={() => setEditingId(m.id)}
                      className="rounded-lg p-2 border-2 border-blue-400 text-blue-400 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(m.id)}
                      disabled={deleteMutation.isPending}
                      className="rounded-lg p-2 border-2 border-red-400 text-red-400 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {members.length === 0 && (
          <p className="text-center text-gray-400 mt-4">No members found</p>
        )}
      </div>
    </div>
  );
}
