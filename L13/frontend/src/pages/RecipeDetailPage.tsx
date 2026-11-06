import { useParams } from "@tanstack/react-router";
import { useRecipe } from "../hooks/useRecipe";

function RecipeDetailPage() {
  const { recipeId } = useParams({ from: "/recipes/$recipeId" });
  const { data: recipe, isLoading, isError } = useRecipe(Number(recipeId));

  if (isLoading) return <p>Loading…</p>;
  if (isError) {
    return <p className="text-red-600">Couldn't load this recipe. Is the API running?</p>;
  }
  if (!recipe) return <p>Not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">{recipe.name}</h1>
      <p className="text-gray-600">
        {recipe.tag ?? "untagged"} · {recipe.servings ?? "?"} servings
      </p>
    </div>
  );
}

export default RecipeDetailPage;
