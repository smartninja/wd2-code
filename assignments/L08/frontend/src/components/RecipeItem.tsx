import type { Recipe } from "../types";

function RecipeItem({ recipe }: { recipe: Recipe }) {
  return (
    <li className="p-3 rounded bg-white shadow flex justify-between items-center">
      <span className="flex gap-3 items-center">
        {/* like {% if recipe.thumb_url %} in Jinja: no photo, no <img> */}
        {recipe.thumb_url && (
          <img
            src={recipe.thumb_url}
            alt={recipe.name}
            className="w-12 h-12 rounded object-cover"
          />
        )}
        <span>
          {recipe.name}
          {recipe.tag && <> — {recipe.tag}</>}
        </span>
      </span>
      {recipe.servings && (
        <span className="text-gray-500">{recipe.servings} servings</span>
      )}
    </li>
  );
}

export default RecipeItem;
