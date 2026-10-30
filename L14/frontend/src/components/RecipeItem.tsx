import { Link } from "@tanstack/react-router";
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
      <Link
        to="/recipes/$recipeId"
        params={{ recipeId: String(recipe.id) }}
        className="text-blue-600"
      >
        {recipe.name}
        {recipe.tag && <span className="text-gray-500"> — {recipe.tag}</span>}
      </Link>
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
