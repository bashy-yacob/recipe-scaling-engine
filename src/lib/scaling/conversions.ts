// src/lib/scaling/conversions.ts

/**
 * Unit conversion system for cooking measurements
 * Supports both metric and imperial systems
 */

interface ConversionRate {
  toGrams: number;
  toMilliliters?: number;
  description: string;
}

// Metric conversions (to grams)
const METRIC_CONVERSIONS: Record<string, ConversionRate> = {
  // Weight
  g: { toGrams: 1, description: 'gram' },
  gram: { toGrams: 1, description: 'gram' },
  grams: { toGrams: 1, description: 'gram' },
  'גרם': { toGrams: 1, description: 'gram' },
  kg: { toGrams: 1000, description: 'kilogram' },
  kilogram: { toGrams: 1000, description: 'kilogram' },
  'קילו': { toGrams: 1000, description: 'kilogram' },

  // Volume (approximate)
  ml: { toGrams: 1, toMilliliters: 1, description: 'milliliter' },
  milliliter: { toGrams: 1, toMilliliters: 1, description: 'milliliter' },
  'מ"ל': { toGrams: 1, toMilliliters: 1, description: 'milliliter' },
  l: { toGrams: 1000, toMilliliters: 1000, description: 'liter' },
  liter: { toGrams: 1000, toMilliliters: 1000, description: 'liter' },
  'ליטר': { toGrams: 1000, toMilliliters: 1000, description: 'liter' },
};

// Imperial conversions (to grams)
const IMPERIAL_CONVERSIONS: Record<string, ConversionRate> = {
  // Weight
  oz: { toGrams: 28.35, description: 'ounce' },
  ounce: { toGrams: 28.35, description: 'ounce' },
  lb: { toGrams: 453.592, description: 'pound' },
  pound: { toGrams: 453.592, description: 'pound' },

  // Volume
  tsp: { toGrams: 5, toMilliliters: 5, description: 'teaspoon' },
  teaspoon: { toGrams: 5, toMilliliters: 5, description: 'teaspoon' },
  'כפית': { toGrams: 5, toMilliliters: 5, description: 'teaspoon' },
  tbsp: { toGrams: 15, toMilliliters: 15, description: 'tablespoon' },
  tablespoon: { toGrams: 15, toMilliliters: 15, description: 'tablespoon' },
  'כף': { toGrams: 15, toMilliliters: 15, description: 'tablespoon' },
  cup: { toGrams: 240, toMilliliters: 240, description: 'cup' },
  cups: { toGrams: 240, toMilliliters: 240, description: 'cup' },
  'כוס': { toGrams: 240, toMilliliters: 240, description: 'cup' },
  fl_oz: { toGrams: 30, toMilliliters: 30, description: 'fluid ounce' },
  pint: { toGrams: 473.176, toMilliliters: 473.176, description: 'pint' },
  quart: { toGrams: 946.353, toMilliliters: 946.353, description: 'quart' },
  gallon: { toGrams: 3785.41, toMilliliters: 3785.41, description: 'gallon' },
};

const ALL_CONVERSIONS = {
  ...METRIC_CONVERSIONS,
  ...IMPERIAL_CONVERSIONS,
};

/**
 * Convert amount from one unit to another
 * @param amount - The amount to convert
 * @param fromUnit - Source unit (e.g., 'cup', 'g', 'tbsp')
 * @param toUnit - Target unit (e.g., 'ml', 'oz')
 * @returns Converted amount
 */
export function convertUnits(amount: number, fromUnit: string, toUnit: string): number {
  const fromNormalized = fromUnit.toLowerCase().trim();
  const toNormalized = toUnit.toLowerCase().trim();

  if (fromNormalized === toNormalized) {
    return amount;
  }

  const fromConversion = ALL_CONVERSIONS[fromNormalized];
  const toConversion = ALL_CONVERSIONS[toNormalized];

  if (!fromConversion) {
    throw new Error(`Unknown unit: ${fromUnit}`);
  }
  if (!toConversion) {
    throw new Error(`Unknown unit: ${toUnit}`);
  }

  // Convert to grams first as a common base
  const grams = amount * fromConversion.toGrams;

  // Then convert to target unit
  return grams / toConversion.toGrams;
}

/**
 * Convert grams to cups (approximate, varies by ingredient)
 * These are approximations for common ingredients
 */
export function gramsToCups(grams: number, ingredient?: string): number {
  const cupsInGrams = 240; // Standard cup = ~240ml/grams

  // Some ingredients have different densities
  const densityFactors: Record<string, number> = {
    flour: 125,
    sugar: 200,
    butter: 227,
    oil: 240,
    water: 240,
    milk: 244,
    honey: 340,
    קמח: 125,
    סוכר: 200,
    חמאה: 227,
    שמן: 240,
    מים: 240,
    חלב: 244,
    דבש: 340,
  };

  const normalizedIngredient = ingredient?.toLowerCase().trim();
  const factor = normalizedIngredient ? densityFactors[normalizedIngredient] || cupsInGrams : cupsInGrams;

  return grams / factor;
}

/**
 * Convert milliliters to cups
 */
export function mlToCups(ml: number): number {
  return ml / 240;
}

/**
 * Convert cups to grams (approximate, varies by ingredient)
 */
export function cupsToGrams(cups: number, ingredient?: string): number {
  const cupsInGrams = 240;

  const densityFactors: Record<string, number> = {
    flour: 125,
    sugar: 200,
    butter: 227,
    oil: 240,
    water: 240,
    milk: 244,
    honey: 340,
    קמח: 125,
    סוכר: 200,
    חמאה: 227,
    שמן: 240,
    מים: 240,
    חלב: 244,
    דבש: 340,
  };

  const normalizedIngredient = ingredient?.toLowerCase().trim();
  const factor = normalizedIngredient ? densityFactors[normalizedIngredient] || cupsInGrams : cupsInGrams;

  return cups * factor;
}

/**
 * Get all available units
 */
export function getAvailableUnits(): string[] {
  return Object.keys(ALL_CONVERSIONS);
}

/**
 * Check if a unit is valid
 */
export function isValidUnit(unit: string): boolean {
  return unit.toLowerCase().trim() in ALL_CONVERSIONS;
}
