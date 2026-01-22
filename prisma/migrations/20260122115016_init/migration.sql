-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "preferredSystem" TEXT NOT NULL DEFAULT 'metric',
    "language" TEXT NOT NULL DEFAULT 'he'
);

-- CreateTable
CREATE TABLE "recipes" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "recipes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameHebrew" TEXT,
    "category" TEXT NOT NULL,
    "scalingRule" TEXT NOT NULL DEFAULT 'linear',
    "calories" REAL,
    "protein" REAL,
    "carbs" REAL,
    "fat" REAL,
    "fiber" REAL,
    "allergens" TEXT,
    "storageInfo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "recipe_ingredients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "preparation" TEXT,
    "optional" BOOLEAN NOT NULL DEFAULT false,
    "scalingRule" TEXT,
    CONSTRAINT "recipe_ingredients_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recipe_ingredients_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "instructions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "time" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "instructions_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "baking_parameters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "ovenTemp" INTEGER,
    "ovenTempF" INTEGER,
    "convection" BOOLEAN NOT NULL DEFAULT false,
    "rackPosition" TEXT,
    "panType" TEXT,
    "panSize" TEXT,
    "panMaterial" TEXT,
    "baseServings" INTEGER NOT NULL,
    "bakingTime" INTEGER,
    "restingTime" INTEGER,
    CONSTRAINT "baking_parameters_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "recipe_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "recipe_tags_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recipe_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "recipe_versions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "changes" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "isPreferred" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "recipe_versions_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "unit_conversions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ingredientId" TEXT,
    "fromUnit" TEXT NOT NULL,
    "toUnit" TEXT NOT NULL,
    "factor" REAL NOT NULL,
    CONSTRAINT "unit_conversions_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "recipes_userId_idx" ON "recipes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_name_key" ON "ingredients"("name");

-- CreateIndex
CREATE INDEX "recipe_ingredients_recipeId_idx" ON "recipe_ingredients"("recipeId");

-- CreateIndex
CREATE INDEX "recipe_ingredients_ingredientId_idx" ON "recipe_ingredients"("ingredientId");

-- CreateIndex
CREATE UNIQUE INDEX "instructions_recipeId_stepNumber_key" ON "instructions"("recipeId", "stepNumber");

-- CreateIndex
CREATE UNIQUE INDEX "baking_parameters_recipeId_key" ON "baking_parameters"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE INDEX "recipe_tags_recipeId_idx" ON "recipe_tags"("recipeId");

-- CreateIndex
CREATE INDEX "recipe_tags_tagId_idx" ON "recipe_tags"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_tags_recipeId_tagId_key" ON "recipe_tags"("recipeId", "tagId");

-- CreateIndex
CREATE INDEX "recipe_versions_recipeId_idx" ON "recipe_versions"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_versions_recipeId_version_key" ON "recipe_versions"("recipeId", "version");

-- CreateIndex
CREATE INDEX "unit_conversions_fromUnit_toUnit_idx" ON "unit_conversions"("fromUnit", "toUnit");

-- CreateIndex
CREATE UNIQUE INDEX "unit_conversions_ingredientId_fromUnit_toUnit_key" ON "unit_conversions"("ingredientId", "fromUnit", "toUnit");
