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
      {/* styled with Tailwind classes only, no CSS file */}
      <footer className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500 text-center">
        Recipe Keeper · built with React and Tailwind
      </footer>
    </div>
  );
}

export default App;
