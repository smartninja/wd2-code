import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecipe, updateRecipe, deleteRecipe } from "../api";

export function useCreateRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createRecipe,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recipes"] }),
  });
}

export function useUpdateRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      id: number;
      input: { name: string; tag: string; servings: number | null };
    }) => updateRecipe(args.id, args.input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recipes"] }),
  });
}

export function useDeleteRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recipes"] }),
  });
}
