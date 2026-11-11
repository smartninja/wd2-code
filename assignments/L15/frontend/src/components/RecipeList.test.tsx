import { render, screen } from "@testing-library/react";
import RecipeList from "./RecipeList";

test("shows a message when there are no recipes", () => {
  // the empty list renders no items (and so no links) — no router needed here
  render(<RecipeList recipes={[]} onDelete={() => {}} />);
  expect(screen.getByText(/no recipes yet/i)).toBeInTheDocument();
});
