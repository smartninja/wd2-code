import { useParams } from "@tanstack/react-router";
import { useRecipe } from "../hooks/useRecipe";

function RecipeDetailPage() {
  const { recipeId } = useParams({ from: "/recipes/$recipeId" });
  const { data: recipe, isLoading } = useRecipe(Number(recipeId));

  if (isLoading) return <p>Loading…</p>;
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
