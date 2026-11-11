function App() {
  const recipes = [
    { id: 1, name: "Pancakes", tag: "breakfast" },
    { id: 2, name: "Omelette", tag: "breakfast" },
  ];

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Recipes</h1>
      <ul className="space-y-2">
        {recipes.map((recipe) => (
          <li key={recipe.id} className="p-3 rounded bg-white shadow">
            {recipe.name} — {recipe.tag}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
