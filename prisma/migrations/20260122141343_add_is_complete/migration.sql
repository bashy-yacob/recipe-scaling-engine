-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_recipe_ingredients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "amount" REAL,
    "unit" TEXT NOT NULL,
    "preparation" TEXT,
    "optional" BOOLEAN NOT NULL DEFAULT false,
    "scalingRule" TEXT,
    CONSTRAINT "recipe_ingredients_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recipe_ingredients_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_recipe_ingredients" ("amount", "id", "ingredientId", "optional", "preparation", "recipeId", "scalingRule", "unit") SELECT "amount", "id", "ingredientId", "optional", "preparation", "recipeId", "scalingRule", "unit" FROM "recipe_ingredients";
DROP TABLE "recipe_ingredients";
ALTER TABLE "new_recipe_ingredients" RENAME TO "recipe_ingredients";
CREATE INDEX "recipe_ingredients_recipeId_idx" ON "recipe_ingredients"("recipeId");
CREATE INDEX "recipe_ingredients_ingredientId_idx" ON "recipe_ingredients"("ingredientId");
CREATE TABLE "new_recipes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "servings" INTEGER NOT NULL DEFAULT 1,
    "prepTime" INTEGER,
    "cookTime" INTEGER,
    "totalTime" INTEGER,
    "source" TEXT,
    "imageUrl" TEXT,
    "rating" INTEGER,
    "notes" TEXT,
    "timesCooked" INTEGER NOT NULL DEFAULT 0,
    "lastCookedAt" DATETIME,
    "isComplete" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "recipes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_recipes" ("cookTime", "createdAt", "description", "id", "imageUrl", "lastCookedAt", "notes", "prepTime", "rating", "servings", "source", "timesCooked", "title", "totalTime", "updatedAt", "userId") SELECT "cookTime", "createdAt", "description", "id", "imageUrl", "lastCookedAt", "notes", "prepTime", "rating", "servings", "source", "timesCooked", "title", "totalTime", "updatedAt", "userId" FROM "recipes";
DROP TABLE "recipes";
ALTER TABLE "new_recipes" RENAME TO "recipes";
CREATE INDEX "recipes_userId_idx" ON "recipes"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
