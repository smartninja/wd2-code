import { Link, useParams } from "@tanstack/react-router";
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
      {/* a router <Link>, not <a href="/">: going back swaps the page, no reload */}
      <Link to="/" className="text-blue-600 mt-4 inline-block">
        Back to list
      </Link>
    </div>
  );
}

export default RecipeDetailPage;
