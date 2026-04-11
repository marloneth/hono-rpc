import { useForm } from "@tanstack/react-form";
import { useUpdateTask } from "./queries/tasks";

export function EditTaskForm({
  task,
  onDone,
}: {
  task: {
    id: string;
    title: string;
    dueDate?: string;
  };
  onDone: () => void;
}) {
  const mutation = useUpdateTask();

  const form = useForm({
    defaultValues: {
      title: task.title,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync({
        id: task.id,
        data: {
          title: value.title,
          dueDate: value.dueDate
            ? new Date(value.dueDate).toISOString()
            : undefined,
        },
      });
      onDone();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex gap-2"
    >
      <form.Field name="title">
        {(field) => (
          <input
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            className="border rounded px-2 py-1"
          />
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

      <button type="submit" className="bg-green-500 text-white px-2 rounded">
        Save
      </button>

      <button type="button" onClick={onDone} className="px-2">
        Cancel
      </button>
    </form>
  );
}
