import { useState } from "react";
import RecipeList from "./components/RecipeList";
import AddRecipeForm from "./components/AddRecipeForm";
import type { Recipe } from "./types";

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  function addRecipe(newRecipe: {
    name: string;
    tag: string;
    servings: number | null;
  }) {
    // new array, don't mutate
    setRecipes([...recipes, { id: Date.now(), ...newRecipe }]);
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Recipes</h1>
      <AddRecipeForm onAdd={addRecipe} />
      <RecipeList recipes={recipes} />
    </div>
  );
}

export default App;
