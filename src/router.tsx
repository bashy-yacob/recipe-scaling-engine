import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { App } from './App';

// Pages
import { HomePage } from './pages/HomePage';
import { RecipeListPage } from './pages/recipes/RecipeListPage';
import { RecipeCreatePage } from './pages/recipes/RecipeCreatePage';
import { RecipeDetailsPage } from './pages/recipes/RecipeDetailsPage';
import { RecipeEditPage } from './pages/recipes/RecipeEditPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { DemoPage } from './pages/demo/DemoPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ErrorPage } from './pages/ErrorPage';

/**
 * Route path constants for type-safe navigation
 */
export const ROUTES = {
  HOME: '/',
  RECIPES: '/recipes',
  RECIPE_NEW: '/recipes/new',
  RECIPE_DETAILS: '/recipes/:id',
  RECIPE_EDIT: '/recipes/:id/edit',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  SETTINGS: '/settings',
  DEMO: '/demo',
} as const;

/**
 * Helper function to generate recipe detail path
 */
export function getRecipeDetailsPath(id: string): string {
  return `/recipes/${id}`;
}

/**
 * Helper function to generate recipe edit path
 */
export function getRecipeEditPath(id: string): string {
  return `/recipes/${id}/edit`;
}

/**
 * Route configuration
 * Centralized routing using createBrowserRouter
 */
const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'recipes',
        children: [
          {
            index: true,
            element: <RecipeListPage />,
          },
          {
            path: 'new',
            element: <RecipeCreatePage />,
          },
          {
            path: ':id',
            element: <RecipeDetailsPage />,
          },
          {
            path: ':id/edit',
            element: <RecipeEditPage />,
          },
        ],
      },
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            element: <LoginPage />,
          },
          {
            path: 'register',
            element: <RegisterPage />,
          },
        ],
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'demo',
        element: <DemoPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
