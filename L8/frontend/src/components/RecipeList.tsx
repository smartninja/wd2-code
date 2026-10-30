import type { Recipe } from "../types";
import RecipeItem from "./RecipeItem";

function RecipeList({ recipes }: { recipes: Recipe[] }) {
  if (recipes.length === 0) {
    return <p className="text-gray-500">No recipes yet.</p>;
  }
  return (
    <ul className="space-y-2">
      {recipes.map((recipe) => (
        <RecipeItem key={recipe.id} recipe={recipe} />
      ))}
    </ul>
  );
}

export default RecipeList;
