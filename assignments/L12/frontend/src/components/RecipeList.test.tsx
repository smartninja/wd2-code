import { render, screen } from "@testing-library/react";
import { renderWithRouter } from "../test-utils";
import RecipeList from "./RecipeList";

test("shows a message when there are no recipes", () => {
  // the empty list renders no items (and so no links) — no router needed here
  render(<RecipeList recipes={[]} onDelete={() => {}} />);
  expect(screen.getByText(/no recipes yet/i)).toBeInTheDocument();
});

test("shows every recipe it is given", async () => {
  // each item's name is a <Link>, so this one needs the router
  renderWithRouter(
    <RecipeList
      recipes={[
        { id: 1, name: "Pancakes", tag: "breakfast", servings: 4 },
        { id: 2, name: "Tomato soup", tag: null, servings: null },
      ]}
      onDelete={() => {}}
    />,
  );
  // the router renders on the next tick, so wait for the first name to appear
  expect(await screen.findByText(/Pancakes/)).toBeInTheDocument();
  expect(screen.getByText(/Tomato soup/)).toBeInTheDocument();
});
