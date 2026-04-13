import { useForm } from "@tanstack/react-form";
import { useCreateTask } from "./queries";

export function CreateTaskForm() {
  const mutation = useCreateTask();

  const form = useForm({
    defaultValues: {
      title: "",
      dueDate: "",
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync({
        title: value.title,
        dueDate: value.dueDate
          ? new Date(value.dueDate).toISOString()
          : undefined,
      });

      form.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex gap-2 mb-4"
    >
      <form.Field
        name="title"
        validators={{
          onChange: ({ value }) => (!value ? "Title is required" : undefined),
        }}
      >
        {(field) => (
          <div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Task title"
              className="border rounded px-2 py-1"
            />
            {field.state.meta.errors && (
              <p className="text-red-500 text-xs">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="dueDate">
        {(field) => (
          <input
            type="date"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            className="border rounded px-2 py-1"
          />
        )}
      </form.Field>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Add
      </button>
    </form>
  );
}
