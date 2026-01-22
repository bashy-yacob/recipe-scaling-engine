// lib/scaling/algorithms.ts

interface ScalingRule {
  type: 'linear' | 'logarithmic' | 'sqrt' | 'fixed';
  baseAmount: number;
  baseServings: number;
}

interface ScaledResult {
  amount: number;
  rounded: number;
}

/**
 * Scale an ingredient amount based on the serving ratio and scaling rule
 * @param rule - The scaling rule configuration
 * @param targetServings - Target number of servings
 * @returns Scaled amount
 */
export function scaleIngredient(rule: ScalingRule, targetServings: number): number {
  const scaled = calculateScaledAmount(rule, targetServings);
  return scaled.amount;
}

/**
 * Scale an ingredient with rounding for practical cooking
 * @param rule - The scaling rule configuration
 * @param targetServings - Target number of servings
 * @returns Scaled amount rounded to practical cooking measurements
 */
export function scaleIngredientRounded(rule: ScalingRule, targetServings: number): number {
  const scaled = calculateScaledAmount(rule, targetServings);
  return roundForCooking(scaled.amount);
}

/**
 * Calculate scaled amount with detailed results
 */
function calculateScaledAmount(rule: ScalingRule, targetServings: number): ScaledResult {
  if (targetServings <= 0) {
    throw new Error('Target servings must be positive');
  }

  const ratio = targetServings / rule.baseServings;

  let amount: number;

  switch (rule.type) {
    case 'linear':
      // Linear scaling: multiply by ratio
      // Example: 2 cups flour for 4 servings → 4 cups for 8 servings
      amount = rule.baseAmount * ratio;
      break;

    case 'logarithmic':
      // Logarithmic scaling: slower growth (for ingredients like yeast, chocolate)
      // Doesn't grow as much with larger batches
      // Formula: baseAmount * (1 + log(ratio) / log(base))
      // Using base 4 means the ingredient grows slowly
      amount = rule.baseAmount * (1 + Math.log(ratio) / Math.log(4));
      break;

    case 'sqrt':
      // Square root scaling: moderate growth (for salt, spices)
      // Grows slower than linear but faster than logarithmic
      // Example: salt grows with sqrt of the ratio
      amount = rule.baseAmount * Math.sqrt(ratio);
      break;

    case 'fixed':
      // Fixed amount: doesn't change (for things like vanilla extract, food coloring)
      // These ingredients don't scale with recipe size
      amount = rule.baseAmount;
      break;

    default:
      throw new Error(`Unknown scaling rule type: ${rule.type}`);
  }

  return {
    amount,
    rounded: roundForCooking(amount),
  };
}

/**
 * Round amounts to practical cooking measurements
 * Helps with user-friendly quantities
 * @param amount - The amount to round
 * @returns Rounded amount
 */
function roundForCooking(amount: number): number {
  // For amounts less than 1, round to nearest 1/8
  if (amount < 1) {
    return Math.round(amount * 8) / 8;
  }

  // For amounts 1-10, round to nearest 0.25 (1/4)
  if (amount <= 10) {
    return Math.round(amount * 4) / 4;
  }

  // For amounts 10-100, round to nearest 0.5
  if (amount <= 100) {
    return Math.round(amount * 2) / 2;
  }

  // For amounts over 100, round to nearest integer
  return Math.round(amount);
}

/**
 * Scale multiple ingredients at once
 */
export function scaleRecipe(
  ingredients: Array<{ amount: number; baseServings: number; scalingRule: ScalingRule['type'] }>,
  targetServings: number,
  baseServings?: number
) {
  return ingredients.map((ing) => ({
    ...ing,
    scaledAmount: scaleIngredient(
      {
        type: ing.scalingRule,
        baseAmount: ing.amount,
        baseServings: baseServings || ing.baseServings,
      },
      targetServings
    ),
  }));
}

/**
 * Calculate scaling ratio between two serving sizes
 */
export function getScalingRatio(baseServings: number, targetServings: number): number {
  if (baseServings <= 0 || targetServings <= 0) {
    throw new Error('Servings must be positive');
  }
  return targetServings / baseServings;
}

/**
 * Get recommended scaling rule based on ingredient name (helper function)
 * This can be expanded with a database or config
 */
export function getDefaultScalingRule(ingredientName: string): ScalingRule['type'] {
  const name = ingredientName.toLowerCase();

  // Logarithmic: yeast, baking powder, baking soda, chocolate, cocoa
  if (
    name.includes('yeast') ||
    name.includes('leaven') ||
    name.includes('chocolate') ||
    name.includes('cocoa')
  ) {
    return 'logarithmic';
  }

  // Square root: salt, spices, seasonings, pepper
  if (
    name.includes('salt') ||
    name.includes('spice') ||
    name.includes('pepper') ||
    name.includes('cinnamon') ||
    name.includes('nutmeg') ||
    name.includes('ginger')
  ) {
    return 'sqrt';
  }

  // Fixed: vanilla, extract, food coloring, lemon juice (some cases)
  if (
    name.includes('vanilla') ||
    name.includes('extract') ||
    name.includes('coloring') ||
    name.includes('color')
  ) {
    return 'fixed';
  }

  // Default: linear
  return 'linear';
}

/**
 * Scale cooking/baking time
 * Usually cooking time doesn't scale linearly
 * Larger batches take more time, but not proportionally more
 */
export function scaleCookingTime(baseTime: number, baseServings: number, targetServings: number): number {
  const ratio = targetServings / baseServings;

  // Time scaling is typically logarithmic
  // Using square root as a good middle ground
  // Doubling servings increases time by ~40%, not 100%
  const scaledTime = baseTime * Math.sqrt(ratio);

  return Math.round(scaledTime);
}

/**
 * Validate scaling rule
 */
export function validateScalingRule(rule: any): rule is ScalingRule {
  return (
    rule &&
    typeof rule === 'object' &&
    ['linear', 'logarithmic', 'sqrt', 'fixed'].includes(rule.type) &&
    typeof rule.baseAmount === 'number' &&
    rule.baseAmount > 0 &&
    typeof rule.baseServings === 'number' &&
    rule.baseServings > 0
  );
}
