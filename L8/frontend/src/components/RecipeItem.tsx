import type { Recipe } from "../types";

function RecipeItem({ recipe }: { recipe: Recipe }) {
  return (
    <li className="p-3 rounded bg-white shadow flex justify-between">
      <span>
        {recipe.name}
        {recipe.tag && <> — {recipe.tag}</>}
      </span>
      {recipe.servings && (
        <span className="text-gray-500">{recipe.servings} servings</span>
      )}
    </li>
  );
}

export default RecipeItem;
