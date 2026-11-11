import type { Recipe } from "../types";
import RecipeItem from "./RecipeItem";

function RecipeList({
  recipes,
  onDelete,
  onUpdate,
}: {
  recipes: Recipe[];
  onDelete: (id: number) => void;
  onUpdate: (
    id: number,
    input: { name: string; tag: string; servings: number | null },
  ) => void;
}) {
  if (recipes.length === 0) {
    return <p className="text-gray-500">No recipes yet.</p>;
  }
  return (
    <ul className="space-y-2">
      {recipes.map((recipe) => (
        <RecipeItem
          key={recipe.id}
          recipe={recipe}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}

export default RecipeList;
