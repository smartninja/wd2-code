import { useNavigate } from "@tanstack/react-router";
import { useCreateRecipe } from "../hooks/useRecipeMutations";
import AddRecipeForm from "../components/AddRecipeForm";

function AddRecipePage() {
  const navigate = useNavigate();
  const create = useCreateRecipe();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add a recipe</h1>
      <AddRecipeForm
        onAdd={(recipe) =>
          // awaiting the create means the form only resets on success (lesson 9);
          // navigating in the .then keeps us on the form if the save failed.
          create.mutateAsync(recipe).then(() => navigate({ to: "/" }))
        }
      />
      {create.isError && (
        <p className="text-red-600">Couldn't save the recipe. Are you logged in?</p>
      )}
    </div>
  );
}

export default AddRecipePage;
