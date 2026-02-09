// src/types/recipe.ts

export type ScalingRule = 'linear' | 'logarithmic' | 'sqrt' | 'fixed';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Ingredient {
  id: string;
  name: string;
  amount: number | null;
  unit: string;
  scalingRule: ScalingRule;
}

export interface Instruction {
  id: string;
  content: string;
  order: number;
  stepNumber?: number;
  description?: string; // Alias for content
}

export interface RecipeImage {
  id: string;
  url: string;
  caption?: string;
  stepNumber?: number;
  order: number;
  isMain: boolean;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
}

export interface Recipe {
  id: string;
  userId: string;
  title: string;
  description?: string;
  servings: number;
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  difficulty?: Difficulty;
  category?: string;
  isComplete?: boolean;
  isPublic?: boolean;
  likeCount?: number;
  isLiked?: boolean;
  user?: User;
  recipeIngredients: Array<{
    ingredient: { name: string };
    amount: number;
    unit: string;
  }>;
  instructions: Instruction[];
  images?: RecipeImage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RecipeListItem {
  id: string;
  title: string;
  description?: string;
  servings: number;
  prepTime?: number;
  cookTime?: number;
  difficulty?: Difficulty;
  category?: string;
  isComplete?: boolean;
  isPublic?: boolean;
  userId: string;
  likeCount: number;
  isLiked: boolean;
  user?: User;
  recipeIngredients: Array<{ ingredient: { name: string } }>;
  instructions: Array<{ content: string }>;
}

export interface CreateRecipeDTO {
  title: string;
  description?: string;
  servings: number;
  prepTime?: number;
  cookTime?: number;
  isComplete?: boolean;
  isPublic?: boolean;
  ingredients: Array<{
    name: string;
    amount: number | null;
    unit: string;
    scalingRule?: ScalingRule;
  }>;
  instructions: Array<{
    content: string;
    order: number;
  }>;
  images?: Array<{
    url: string;
    caption?: string;
    stepNumber?: number;
    order: number;
    isMain?: boolean;
  }>;
}

export interface UpdateRecipeDTO extends Partial<CreateRecipeDTO> {}
