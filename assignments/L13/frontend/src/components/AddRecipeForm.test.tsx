import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddRecipeForm from "./AddRecipeForm";

test("submitting calls onAdd with the entered values", async () => {
  const onAdd = vi.fn();
  render(<AddRecipeForm onAdd={onAdd} />);

  await userEvent.type(screen.getByPlaceholderText("Recipe name"), "Soup");
  await userEvent.type(screen.getByPlaceholderText("Tag"), "dinner");
  await userEvent.click(screen.getByRole("button", { name: /add/i }));

  expect(onAdd).toHaveBeenCalledWith(
    expect.objectContaining({ name: "Soup", tag: "dinner" }),
  );
});

test("does not submit an empty name", async () => {
  const onAdd = vi.fn();
  render(<AddRecipeForm onAdd={onAdd} />);

  await userEvent.click(screen.getByRole("button", { name: /add/i }));

  expect(onAdd).not.toHaveBeenCalled();
});
