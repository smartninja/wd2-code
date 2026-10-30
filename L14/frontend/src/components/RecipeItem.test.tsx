import { screen } from "@testing-library/react";
import { renderWithRouter } from "../test-utils";
import RecipeItem from "./RecipeItem";

test("shows the recipe name and tag", async () => {
  renderWithRouter(
    <RecipeItem
      recipe={{ id: 1, name: "Pancakes", tag: "breakfast", servings: 4 }}
      onDelete={() => {}}
    />,
  );
  // the router renders on the next tick, so wait for the text to appear
  expect(await screen.findByText(/Pancakes/)).toBeInTheDocument();
  expect(screen.getByText(/breakfast/)).toBeInTheDocument();
});
