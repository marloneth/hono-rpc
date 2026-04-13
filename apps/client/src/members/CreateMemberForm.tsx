import { useForm } from "@tanstack/react-form";
import { useCreateMember } from "./queries";
import type { MemberRole } from "./api";
import { RoleSelect } from "./components/RoleSelect";

export function CreateMemberForm() {
  const mutation = useCreateMember();

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      role: "developer" as MemberRole,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
      form.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-2 mb-4"
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

      <div className="flex gap-2">
        <form.Field name="password">
          {(field) => (
            <input
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Password"
              className="border rounded px-2 py-1 flex-1"
            />
          )}
        </form.Field>

        <form.Field name="role">
          {(field) => (
            <RoleSelect
              value={field.state.value}
              onChange={(val) => field.handleChange(val!)}
              className="border rounded px-2 py-1"
            />
          )}
        </form.Field>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Add Member
      </button>
    </form>
  );
}
