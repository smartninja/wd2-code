import { useState } from "react";
import type { Recipe } from "../types";

type RecipeInput = { name: string; tag: string; servings: number | null };

function RecipeItem({
  recipe,
  onDelete,
  onUpdate,
}: {
  recipe: Recipe;
  onDelete: (id: number) => void;
  onUpdate: (id: number, input: RecipeInput) => void;
}) {
  // Only this row needs to know it's being edited, so the state lives here.
  const [editing, setEditing] = useState(false);
  const [tag, setTag] = useState("");

  function startEditing() {
    setTag(recipe.tag ?? ""); // start from the saved tag
    setEditing(true);
  }

  function save() {
    // PUT replaces the whole recipe and requires a name, so send every field,
    // not just the tag that changed.
    onUpdate(recipe.id, { name: recipe.name, tag, servings: recipe.servings });
    setEditing(false);
  }

  return (
    <li className="p-3 rounded bg-white shadow flex justify-between items-center">
      <span>
        {recipe.name}
        {editing ? (
          <span className="ml-2 inline-flex gap-2 items-center">
            <input
              className="border rounded px-2 py-1 text-sm"
              placeholder="Tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
            <button onClick={save} className="text-blue-600 text-sm">
              Save
            </button>
            <button onClick={() => setEditing(false)} className="text-gray-500 text-sm">
              Cancel
            </button>
          </span>
        ) : (
          recipe.tag && <> — {recipe.tag}</>
        )}
      </span>
      <span className="flex gap-3 items-center">
        {recipe.servings && (
          <span className="text-gray-500">{recipe.servings} servings</span>
        )}
        {!editing && (
          <button onClick={startEditing} className="text-blue-600 text-sm">
            Edit tag
          </button>
        )}
        <button
          onClick={() => onDelete(recipe.id)}
          className="text-red-600 text-sm"
        >
          Delete
        </button>
      </span>
    </li>
  );
}

export default RecipeItem;
