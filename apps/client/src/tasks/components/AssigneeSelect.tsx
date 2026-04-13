import { useGetMemberList } from "../../members/queries";
import { MemberAvatar } from "../../members/components/MemberAvatar";
import { useAssignMember, useRemoveMember } from "../queries";

interface AssigneeSelectProps {
  taskId: string;
  ownerId: string | null;
}

export function AssigneeSelect({ taskId, ownerId }: AssigneeSelectProps) {
  const { data: members = [] } = useGetMemberList();
  const assignMutation = useAssignMember();
  const removeMutation = useRemoveMember();

  const isPending = assignMutation.isPending || removeMutation.isPending;
  const owner = members.find((m) => m.id === ownerId) ?? null;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "") {
      removeMutation.mutate(taskId);
    } else {
      assignMutation.mutate({ taskId, memberId: value });
    }
  };

  return (
    <div className="flex items-center gap-1">
      {owner && (
        <MemberAvatar
          id={owner.id}
          firstName={owner.firstName}
          lastName={owner.lastName}
          size="sm"
        />
      )}
      <select
        value={ownerId ?? ""}
        onChange={handleChange}
        disabled={isPending}
        className="text-sm border rounded px-1 py-0.5 text-gray-600"
      >
        <option value="">Unassigned</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.firstName} {m.lastName}
          </option>
        ))}
      </select>
    </div>
  );
}
