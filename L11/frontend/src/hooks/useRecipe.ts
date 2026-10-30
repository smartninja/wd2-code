import { useQuery } from "@tanstack/react-query";
import { getRecipe } from "../api";

export function useRecipe(id: number) {
  return useQuery({
    queryKey: ["recipes", id],
    queryFn: () => getRecipe(id),
  });
}
