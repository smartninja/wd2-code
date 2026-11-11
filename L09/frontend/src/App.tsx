import { useRecipes } from "./hooks/useRecipes";
import { useCreateRecipe, useDeleteRecipe } from "./hooks/useRecipeMutations";
import RecipeList from "./components/RecipeList";
import AddRecipeForm from "./components/AddRecipeForm";
import AuthStatus from "./components/AuthStatus";

function App() {
  const { data: recipes, isLoading, isError } = useRecipes();
  const create = useCreateRecipe();
  const remove = useDeleteRecipe();

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Recipes</h1>
      <AuthStatus />
      <AddRecipeForm
        onAdd={async (recipe) => {
          await create.mutateAsync(recipe); // wait, so the form resets only on success
        }}
      />
      {create.isError && (
        <p className="text-red-600 mb-4">Couldn't save the recipe. Are you logged in?</p>
      )}

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

export default App;
