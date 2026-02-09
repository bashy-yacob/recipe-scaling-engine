// src/lib/api/recipes.ts

import { apiFetch, ApiResponse } from './config';
import type { Recipe, RecipeListItem, CreateRecipeDTO, UpdateRecipeDTO } from '@/types/recipe';

export interface RecipeFilters {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  difficulty?: string;
  category?: string;
  maxPrepTime?: string;
  maxCookTime?: string;
  search?: string;
}

/**
 * Fetch all recipes with optional filters
 */
export async function getRecipes(filters?: RecipeFilters): Promise<ApiResponse<RecipeListItem[]>> {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
  }

  const query = params.toString();
  const endpoint = query ? `/recipes?${query}` : '/recipes';
  
  return apiFetch<RecipeListItem[]>(endpoint);
}

/**
 * Fetch a single recipe by ID
 */
export async function getRecipeById(id: string): Promise<ApiResponse<Recipe>> {
  return apiFetch<Recipe>(`/recipes/${id}`);
}

/**
 * Create a new recipe
 */
export async function createRecipe(data: CreateRecipeDTO): Promise<ApiResponse<Recipe>> {
  return apiFetch<Recipe>('/recipes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing recipe
 */
export async function updateRecipe(id: string, data: UpdateRecipeDTO): Promise<ApiResponse<Recipe>> {
  return apiFetch<Recipe>(`/recipes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a recipe
 */
export async function deleteRecipe(id: string): Promise<ApiResponse<void>> {
  return apiFetch<void>(`/recipes/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Toggle recipe like
 */
export async function toggleRecipeLike(id: string): Promise<ApiResponse<{ liked: boolean; likeCount: number }>> {
  return apiFetch<{ liked: boolean; likeCount: number }>(`/recipes/${id}/like`, {
    method: 'POST',
  });
}

/**
 * Toggle recipe public/private status
 */
export async function toggleRecipePublic(id: string, isPublic: boolean): Promise<ApiResponse<Recipe>> {
  return apiFetch<Recipe>(`/recipes/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ isPublic }),
  });
}

/**
 * Parse recipe from text using AI
 */
export async function parseRecipeFromText(text: string): Promise<ApiResponse<Partial<CreateRecipeDTO>>> {
  return apiFetch<Partial<CreateRecipeDTO>>('/recipes/parse', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}
