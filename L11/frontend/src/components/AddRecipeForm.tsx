import { useForm } from "@tanstack/react-form";

type NewRecipe = { name: string; tag: string; servings: number | null };

function AddRecipeForm({
  onAdd,
}: {
  onAdd: (recipe: NewRecipe) => void | Promise<void>;
}) {
  const form = useForm({
    defaultValues: { name: "", tag: "", servings: "" },
    onSubmit: async ({ value }) => {
      try {
        await onAdd({
          name: value.name,
          tag: value.tag,
          servings: value.servings ? Number(value.servings) : null,
        });
        form.reset(); // awaiting onAdd means this only runs once it succeeds
      } catch {
        // the save failed: keep what the user typed (the page shows the error)
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="mb-4 space-y-2"
    >
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            value.trim() === "" ? "Name is required" : undefined,
        }}
      >
        {(field) => (
          <div>
            <input
              className="border rounded px-2 py-1 w-full"
              placeholder="Recipe name"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors[0] && (
              <p className="text-red-600 text-sm">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="tag">
        {(field) => (
          <input
            className="border rounded px-2 py-1 w-full"
            placeholder="Tag"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>

      <button className="px-3 py-1 rounded bg-blue-600 text-white">Add</button>
    </form>
  );
}

export default AddRecipeForm;
