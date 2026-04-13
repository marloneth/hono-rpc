import { useForm } from "@tanstack/react-form";
import { useUpdateMember } from "./queries/members";
import type { Member } from "./api/members";
import { RoleSelect } from "./components/RoleSelect";

export function EditMemberForm({
  member,
  onDone,
}: {
  member: Member;
  onDone: () => void;
}) {
  const mutation = useUpdateMember();

  const form = useForm({
    defaultValues: {
      firstName: member.firstName,
      lastName: member.lastName,
      userName: member.userName,
      email: member.email,
      role: member.role,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync({ id: member.id, data: value });
      onDone();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-2"
    >
      <div className="flex gap-2">
        <form.Field name="firstName">
          {(field) => (
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="First name"
              className="border rounded px-2 py-1 flex-1"
            />
          )}
        </form.Field>

        <form.Field name="lastName">
          {(field) => (
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Last name"
              className="border rounded px-2 py-1 flex-1"
            />
          )}
        </form.Field>
      </div>

      <div className="flex gap-2">
        <form.Field name="userName">
          {(field) => (
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Username"
              className="border rounded px-2 py-1 flex-1"
            />
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <input
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Email"
              className="border rounded px-2 py-1 flex-1"
            />
          )}
        </form.Field>
      </div>

      <form.Field name="role">
        {(field) => (
          <RoleSelect
            value={field.state.value}
            onChange={(val) => field.handleChange(val!)}
            className="border rounded px-2 py-1"
          />
        )}
      </form.Field>

      <div className="flex gap-2">
        <button type="submit" className="bg-green-500 text-white px-2 rounded">
          Save
        </button>
        <button type="button" onClick={onDone} className="px-2">
          Cancel
        </button>
      </div>
    </form>
  );
}
