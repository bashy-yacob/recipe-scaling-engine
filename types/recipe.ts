// types/recipe.ts

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  scalingRule: 'linear' | 'logarithmic' | 'sqrt' | 'fixed';
}

export interface Instruction {
  id: string;
  content: string;
  order: number;
}

export interface Recipe {
  id: string;
  userId: string;
  title: string;
  servings: number;
  ingredients: Ingredient[];
  instructions: Instruction[];
  cookTime: number;
  prepTime: number;
  createdAt?: Date;
  updatedAt?: Date;
}
