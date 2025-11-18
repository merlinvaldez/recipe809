export type DietTag =
  | "vegan"
  | "vegetarian"
  | "gluten-free"
  | "dairy-free"
  | "keto"
  | "paleo";
export type CourseTag =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "dessert"
  | "snack"
  | "drink";

export interface Ingredient {
  name: string;
  quantity?: number;
  unit?: string;
  note?: string;
}

export interface Recipe {
  id: string; // uuid-like or slug
  slug: string;
  title: string;
  description?: string;
  image: string; // remote URL
  prepTime?: number; // minutes
  cookTime?: number; // minutes
  totalTime?: number; // minutes
  servings?: number;
  ingredients: Ingredient[];
  steps: string[];
  tags: string[]; // free-form quick labels like 'quick', 'one-pot'
  cuisine?: string;
  diet: DietTag[];
  course: CourseTag;
  sourceUrl?: string;
}

export type SortOption = "relevance" | "time" | "title";

export interface SearchQuery {
  text: string;
  diet: DietTag[];
  course?: CourseTag;
  quickOnly: boolean; // totalTime <= 30
  sort: SortOption;
}

export interface FavoriteStore {
  favorites: Set<string>; // recipe ids
}
