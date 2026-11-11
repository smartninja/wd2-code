import type { Recipe } from "../types";

function RecipeItem({
  recipe,
  onDelete,
}: {
  recipe: Recipe;
  onDelete: (id: number) => void;
}) {
  return (
    <li className="p-3 rounded bg-white shadow flex justify-between items-center">
      <span>
        {recipe.name}
        {recipe.tag && <> — {recipe.tag}</>}
      </span>
      <span className="flex gap-3 items-center">
        {recipe.servings && (
          <span className="text-gray-500">{recipe.servings} servings</span>
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
