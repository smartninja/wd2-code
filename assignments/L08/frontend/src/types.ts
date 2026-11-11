export type Recipe = {
  id: number;
  name: string;
  tag: string | null;
  servings: number | null;
  // optional (?): recipes made by the form have no photo, so they leave it out
  thumb_url?: string | null;
};