import { useRecipes } from "../hooks/useRecipes";
import { useDeleteRecipe } from "../hooks/useRecipeMutations";
import RecipeList from "../components/RecipeList";

function RecipeListPage() {
  const { data: recipes, isLoading, isError } = useRecipes();
  const remove = useDeleteRecipe();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Recipes</h1>
      {isLoading && <p className="text-gray-500">Loading recipes…</p>}
      {isError && (
        <p className="text-red-600">Couldn't load recipes. Is the API running?</p>
      )}
      {recipes && (
        <RecipeList recipes={recipes} onDelete={(id) => remove.mutate(id)} />
      )}
    </div>
  );
}

export default RecipeListPage;
