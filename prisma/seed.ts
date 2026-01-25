import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
const dbPath = dbUrl.replace('file:', '');
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // ============================================
  // 1. CLEAR EXISTING DATA
  // ============================================
  console.log('🗑️  Clearing existing data...');
  try {
    await prisma.recipeIngredient.deleteMany({});
    await prisma.instruction.deleteMany({});
    await prisma.bakingParameters.deleteMany({});
    await prisma.recipeVersion.deleteMany({});
    await prisma.recipeTag.deleteMany({});
    await prisma.recipe.deleteMany({});
    await prisma.ingredient.deleteMany({});
    await prisma.tag.deleteMany({});
    await prisma.unitConversion.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ Data cleared');
  } catch (e) {
    console.log('ℹ️  No existing data to clear');
  }

  // ============================================
  // 2. CREATE USER
  // ============================================
  console.log('👤 Creating user...');
  const user = await prisma.user.create({
    data: {
      email: 'demo@recipe.com',
      name: 'משתמש דמו',
      preferredSystem: 'metric',
      language: 'he',
    },
  });
  console.log('✅ User created:', user.email);

  // ============================================
  // 2. CREATE INGREDIENTS
  // ============================================
  console.log('🥚 Creating ingredients...');
  
  const ingredients = await Promise.all([
    // Flour
    prisma.ingredient.create({
      data: {
        name: 'All-Purpose Flour',
        nameHebrew: 'קמח לבן',
        category: 'flour',
        scalingRule: 'linear',
        calories: 364,
        protein: 10.3,
        carbs: 76.3,
        fat: 1,
        fiber: 2.7,
      },
    }),
    
    // Sugar
    prisma.ingredient.create({
      data: {
        name: 'White Sugar',
        nameHebrew: 'סוכר לבן',
        category: 'sugar',
        scalingRule: 'squareRoot',
        calories: 387,
        protein: 0,
        carbs: 100,
        fat: 0,
        fiber: 0,
      },
    }),
    
    // Brown Sugar
    prisma.ingredient.create({
      data: {
        name: 'Brown Sugar',
        nameHebrew: 'סוכר חום',
        category: 'sugar',
        scalingRule: 'squareRoot',
        calories: 380,
        protein: 0.1,
        carbs: 98.1,
        fat: 0,
        fiber: 0,
      },
    }),
    
    // Eggs
    prisma.ingredient.create({
      data: {
        name: 'Eggs',
        nameHebrew: 'בייצים',
        category: 'protein',
        scalingRule: 'linear',
        calories: 143,
        protein: 12.6,
        carbs: 0.7,
        fat: 9.5,
        fiber: 0,
        allergens: JSON.stringify(['eggs']),
      },
    }),
    
    // Butter
    prisma.ingredient.create({
      data: {
        name: 'Butter',
        nameHebrew: 'חמאה',
        category: 'fat',
        scalingRule: 'linear',
        calories: 717,
        protein: 0.9,
        carbs: 0.1,
        fat: 81.1,
        fiber: 0,
        allergens: JSON.stringify(['dairy']),
      },
    }),
    
    // Vegetable Oil
    prisma.ingredient.create({
      data: {
        name: 'Vegetable Oil',
        nameHebrew: 'שמן צמחי',
        category: 'fat',
        scalingRule: 'linear',
        calories: 884,
        protein: 0,
        carbs: 0,
        fat: 100,
        fiber: 0,
      },
    }),
    
    // Baking Powder
    prisma.ingredient.create({
      data: {
        name: 'Baking Powder',
        nameHebrew: 'אבקת אפייה',
        category: 'leavening',
        scalingRule: 'logarithmic',
        calories: 53,
        protein: 0,
        carbs: 28,
        fat: 0,
        fiber: 0.2,
      },
    }),
    
    // Baking Soda
    prisma.ingredient.create({
      data: {
        name: 'Baking Soda',
        nameHebrew: 'סודה לשתייה',
        category: 'leavening',
        scalingRule: 'logarithmic',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      },
    }),
    
    // Yeast
    prisma.ingredient.create({
      data: {
        name: 'Active Dry Yeast',
        nameHebrew: 'שמרים יבשים',
        category: 'leavening',
        scalingRule: 'logarithmic',
        calories: 325,
        protein: 40.4,
        carbs: 41.2,
        fat: 7.6,
        fiber: 26.9,
      },
    }),
    
    // Salt
    prisma.ingredient.create({
      data: {
        name: 'Salt',
        nameHebrew: 'מלח',
        category: 'spice',
        scalingRule: 'squareRoot',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      },
    }),
    
    // Vanilla Extract
    prisma.ingredient.create({
      data: {
        name: 'Vanilla Extract',
        nameHebrew: 'תמצית וניל',
        category: 'spice',
        scalingRule: 'squareRoot',
        calories: 288,
        protein: 0.1,
        carbs: 12.7,
        fat: 0.1,
        fiber: 0,
      },
    }),
    
    // Milk
    prisma.ingredient.create({
      data: {
        name: 'Milk',
        nameHebrew: 'חלב',
        category: 'liquid',
        scalingRule: 'linear',
        calories: 61,
        protein: 3.2,
        carbs: 4.8,
        fat: 3.3,
        fiber: 0,
        allergens: JSON.stringify(['dairy']),
      },
    }),
    
    // Water
    prisma.ingredient.create({
      data: {
        name: 'Water',
        nameHebrew: 'מים',
        category: 'liquid',
        scalingRule: 'linear',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      },
    }),
    
    // Cocoa Powder
    prisma.ingredient.create({
      data: {
        name: 'Cocoa Powder',
        nameHebrew: 'אבקת קקאו',
        category: 'other',
        scalingRule: 'linear',
        calories: 228,
        protein: 19.6,
        carbs: 57.9,
        fat: 13.7,
        fiber: 33.2,
      },
    }),
    
    // Chocolate Chips
    prisma.ingredient.create({
      data: {
        name: 'Chocolate Chips',
        nameHebrew: 'שוקולד צ\'יפס',
        category: 'other',
        scalingRule: 'linear',
        calories: 479,
        protein: 4.2,
        carbs: 63.2,
        fat: 25.3,
        fiber: 5.3,
        allergens: JSON.stringify(['dairy']),
      },
    }),
  ]);
  
  console.log(`✅ Created ${ingredients.length} ingredients`);

  // ============================================
  // 3. CREATE UNIT CONVERSIONS
  // ============================================
  console.log('🔄 Creating unit conversions...');
  
  await Promise.all([
    // General conversions
    prisma.unitConversion.create({
      data: { fromUnit: 'cup', toUnit: 'ml', factor: 240 },
    }),
    prisma.unitConversion.create({
      data: { fromUnit: 'tbsp', toUnit: 'ml', factor: 15 },
    }),
    prisma.unitConversion.create({
      data: { fromUnit: 'tsp', toUnit: 'ml', factor: 5 },
    }),
    prisma.unitConversion.create({
      data: { fromUnit: 'cup', toUnit: 'tbsp', factor: 16 },
    }),
    prisma.unitConversion.create({
      data: { fromUnit: 'tbsp', toUnit: 'tsp', factor: 3 },
    }),
    
    // Flour specific (1 cup = ~120g)
    prisma.unitConversion.create({
      data: {
        ingredientId: ingredients[0].id,
        fromUnit: 'cup',
        toUnit: 'g',
        factor: 120,
      },
    }),
    
    // Sugar specific (1 cup = ~200g)
    prisma.unitConversion.create({
      data: {
        ingredientId: ingredients[1].id,
        fromUnit: 'cup',
        toUnit: 'g',
        factor: 200,
      },
    }),
    
    // Butter specific (1 cup = ~227g)
    prisma.unitConversion.create({
      data: {
        ingredientId: ingredients[4].id,
        fromUnit: 'cup',
        toUnit: 'g',
        factor: 227,
      },
    }),
  ]);
  
  console.log('✅ Unit conversions created');

  // ============================================
  // 4. CREATE TAGS
  // ============================================
  console.log('🏷️  Creating tags...');
  
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'מתוק', color: '#FF6B9D' } }),
    prisma.tag.create({ data: { name: 'מלוח', color: '#4ECDC4' } }),
    prisma.tag.create({ data: { name: 'טבעוני', color: '#95E1D3' } }),
    prisma.tag.create({ data: { name: 'צמחוני', color: '#A8E6CF' } }),
    prisma.tag.create({ data: { name: 'ללא גלוטן', color: '#FFD3B6' } }),
    prisma.tag.create({ data: { name: 'קל להכנה', color: '#FFAAA5' } }),
    prisma.tag.create({ data: { name: 'עוגות', color: '#C7CEEA' } }),
    prisma.tag.create({ data: { name: 'עוגיות', color: '#FFDAC1' } }),
    prisma.tag.create({ data: { name: 'לחמים', color: '#B5EAD7' } }),
    prisma.tag.create({ data: { name: 'קינוחים', color: '#E2F0CB' } }),
  ]);
  
  console.log(`✅ Created ${tags.length} tags`);

  // ============================================
  // 5. CREATE RECIPES
  // ============================================
  console.log('📖 Creating recipes...');

  // Recipe 1: Chocolate Cake
  const chocolateCake = await prisma.recipe.create({
    data: {
      userId: user.id,
      title: 'עוגת שוקולד קלאסית',
      description: 'עוגת שוקולד רכה ועשירה, מושלמת לכל אירוע',
      servings: 8,
      prepTime: 20,
      cookTime: 35,
      totalTime: 55,
      rating: 5,
      timesCooked: 12,
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
      notes: 'עובדת מצוין גם עם קמח מלא. אפשר להוסיף שוקולד צ\'יפס',
      
      recipeIngredients: {
        create: [
          {
            ingredientId: ingredients[0].id, // Flour
            amount: 250,
            unit: 'g',
          },
          {
            ingredientId: ingredients[1].id, // Sugar
            amount: 200,
            unit: 'g',
          },
          {
            ingredientId: ingredients[13].id, // Cocoa
            amount: 50,
            unit: 'g',
          },
          {
            ingredientId: ingredients[6].id, // Baking Powder
            amount: 2,
            unit: 'tsp',
          },
          {
            ingredientId: ingredients[7].id, // Baking Soda
            amount: 1,
            unit: 'tsp',
          },
          {
            ingredientId: ingredients[9].id, // Salt
            amount: 0.5,
            unit: 'tsp',
          },
          {
            ingredientId: ingredients[3].id, // Eggs
            amount: 2,
            unit: 'unit',
          },
          {
            ingredientId: ingredients[11].id, // Milk
            amount: 240,
            unit: 'ml',
          },
          {
            ingredientId: ingredients[5].id, // Oil
            amount: 120,
            unit: 'ml',
          },
          {
            ingredientId: ingredients[10].id, // Vanilla
            amount: 2,
            unit: 'tsp',
          },
        ],
      },
      
      instructions: {
        create: [
          {
            stepNumber: 1,
            description: 'חממו תנור ל-180 מעלות. שמנו ותפחו תבנית עגולה בקוטר 23 ס"מ',
            time: 5,
          },
          {
            stepNumber: 2,
            description: 'בקערה גדולה, נפו יחד קמח, סוכר, קקאו, אבקת אפייה, סודה ומלח',
            time: 5,
          },
          {
            stepNumber: 3,
            description: 'הוסיפו ביצים, חלב, שמן ווניל. טרפו במיקסר במהירות בינונית למשך 2 דקות',
            time: 3,
          },
          {
            stepNumber: 4,
            description: 'מזגו לתבנית המוכנה. אפו ל-30-35 דקות עד שקיסם יוצא נקי',
            time: 35,
          },
          {
            stepNumber: 5,
            description: 'הניחו להתקרר בתבנית 10 דקות, ואז העבירו לרשת צינון',
            time: 15,
          },
        ],
      },
      
      bakingParameters: {
        create: {
          baseServings: 8,
          ovenTemp: 180,
          ovenTempF: 356,
          panType: 'round cake pan',
          panSize: '23cm',
          panMaterial: 'metal',
          rackPosition: 'middle',
          bakingTime: 35,
        },
      },
      
      tags: {
        create: [
          { tagId: tags[0].id }, // מתוק
          { tagId: tags[6].id }, // עוגות
          { tagId: tags[9].id }, // קינוחים
        ],
      },
    },
  });

  // Recipe 2: Chocolate Chip Cookies
  const cookies = await prisma.recipe.create({
    data: {
      userId: user.id,
      title: 'עוגיות שוקולד צ\'יפס',
      description: 'עוגיות פריכות מבחוץ ורכות מבפנים עם המון שוקולד',
      servings: 24,
      prepTime: 15,
      cookTime: 12,
      totalTime: 27,
      rating: 5,
      timesCooked: 25,
      imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e',
      notes: 'חשוב לא לאפות יתר על המידה כדי שיישארו רכות',
      
      recipeIngredients: {
        create: [
          {
            ingredientId: ingredients[0].id, // Flour
            amount: 280,
            unit: 'g',
          },
          {
            ingredientId: ingredients[7].id, // Baking Soda
            amount: 1,
            unit: 'tsp',
          },
          {
            ingredientId: ingredients[9].id, // Salt
            amount: 1,
            unit: 'tsp',
          },
          {
            ingredientId: ingredients[4].id, // Butter
            amount: 225,
            unit: 'g',
            preparation: 'ממוסס',
          },
          {
            ingredientId: ingredients[2].id, // Brown Sugar
            amount: 200,
            unit: 'g',
          },
          {
            ingredientId: ingredients[1].id, // White Sugar
            amount: 100,
            unit: 'g',
          },
          {
            ingredientId: ingredients[3].id, // Eggs
            amount: 2,
            unit: 'unit',
          },
          {
            ingredientId: ingredients[10].id, // Vanilla
            amount: 2,
            unit: 'tsp',
          },
          {
            ingredientId: ingredients[14].id, // Chocolate Chips
            amount: 340,
            unit: 'g',
          },
        ],
      },
      
      instructions: {
        create: [
          {
            stepNumber: 1,
            description: 'חממו תנור ל-190 מעלות. הניחו נייר אפייה על תבניות',
            time: 5,
          },
          {
            stepNumber: 2,
            description: 'נפו יחד קמח, סודה ומלח',
            time: 2,
          },
          {
            stepNumber: 3,
            description: 'קצפו חמאה וסוכר למשך 3 דקות עד לקבלת תערובת אוורירית',
            time: 4,
          },
          {
            stepNumber: 4,
            description: 'הוסיפו ביצים ווניל, טרפו היטב',
            time: 2,
          },
          {
            stepNumber: 5,
            description: 'הוסיפו בהדרגה את תערובת הקמח. ערבבו עד לאיחוד',
            time: 2,
          },
          {
            stepNumber: 6,
            description: 'הוסיפו שוקולד צ\'יפס וערבבו',
            time: 1,
          },
          {
            stepNumber: 7,
            description: 'שימו כפות עגולות של בצק על התבנית ברווח של 5 ס"מ',
            time: 5,
          },
          {
            stepNumber: 8,
            description: 'אפו 10-12 דקות עד שהקצוות מזהיבים. הניחו להתקרר על התבנית',
            time: 15,
          },
        ],
      },
      
      bakingParameters: {
        create: {
          baseServings: 24,
          ovenTemp: 190,
          ovenTempF: 374,
          panType: 'baking sheet',
          panMaterial: 'metal',
          rackPosition: 'middle',
          bakingTime: 12,
        },
      },
      
      tags: {
        create: [
          { tagId: tags[0].id }, // מתוק
          { tagId: tags[7].id }, // עוגיות
          { tagId: tags[9].id }, // קינוחים
        ],
      },
    },
  });

  // Recipe 3: Simple White Bread
  const bread = await prisma.recipe.create({
    data: {
      userId: user.id,
      title: 'לחם לבן ביתי',
      description: 'לחם לבן קלאסי רך ואוורירי, מושלם לכריכים',
      servings: 12,
      prepTime: 20,
      cookTime: 30,
      totalTime: 170, // includes rising time
      rating: 4,
      timesCooked: 8,
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
      notes: 'חשוב לתת לבצק להתפח היטב. אפשר להוסיף זרעים לפי הטעם',
      
      recipeIngredients: {
        create: [
          {
            ingredientId: ingredients[0].id, // Flour
            amount: 500,
            unit: 'g',
          },
          {
            ingredientId: ingredients[8].id, // Yeast
            amount: 7,
            unit: 'g',
          },
          {
            ingredientId: ingredients[9].id, // Salt
            amount: 2,
            unit: 'tsp',
          },
          {
            ingredientId: ingredients[1].id, // Sugar
            amount: 2,
            unit: 'tbsp',
          },
          {
            ingredientId: ingredients[12].id, // Water
            amount: 300,
            unit: 'ml',
            preparation: 'פושרים',
          },
          {
            ingredientId: ingredients[5].id, // Oil
            amount: 2,
            unit: 'tbsp',
          },
        ],
      },
      
      instructions: {
        create: [
          {
            stepNumber: 1,
            description: 'ערבבו מים פושרים, שמרים וסוכר. תנו לשמרים להתעורר 5 דקות',
            time: 5,
          },
          {
            stepNumber: 2,
            description: 'בקערה גדולה, ערבבו קמח ומלח',
            time: 2,
          },
          {
            stepNumber: 3,
            description: 'הוסיפו תערובת שמרים ושמן. לשו 8-10 דקות עד קבלת בצק גמיש',
            time: 10,
          },
          {
            stepNumber: 4,
            description: 'הניחו בקערה משומנת, כסו, ותנו להתפח שעה וחצי',
            time: 90,
          },
          {
            stepNumber: 5,
            description: 'הוציאו את האוויר מהבצק, עצבו לצורת כיכר, והניחו בתבנית משומנת',
            time: 5,
          },
          {
            stepNumber: 6,
            description: 'תנו להתפח 30 דקות נוספות',
            time: 30,
          },
          {
            stepNumber: 7,
            description: 'חממו תנור ל-200 מעלות. אפו 30 דקות עד שהלחם נשמע חלול בהקשה',
            time: 35,
          },
          {
            stepNumber: 8,
            description: 'הניחו להתקרר על רשת לפני חיתוך',
            time: 15,
          },
        ],
      },
      
      bakingParameters: {
        create: {
          baseServings: 12,
          ovenTemp: 200,
          ovenTempF: 392,
          panType: 'loaf pan',
          panSize: '24cm',
          panMaterial: 'metal',
          rackPosition: 'middle',
          bakingTime: 30,
          restingTime: 120, // total rising time
        },
      },
      
      tags: {
        create: [
          { tagId: tags[3].id }, // צמחוני
          { tagId: tags[8].id }, // לחמים
        ],
      },
    },
  });

  console.log('✅ Created 3 recipes');

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n🎉 Seed completed successfully!');
  console.log('=====================================');
  console.log(`👤 Users: 1 (${user.email})`);
  console.log(`🥚 Ingredients: ${ingredients.length}`);
  console.log(`🔄 Unit Conversions: 8`);
  console.log(`🏷️  Tags: ${tags.length}`);
  console.log(`📖 Recipes: 3`);
  console.log('=====================================');
  console.log('\n✨ הנתונים מוכנים להשתמש!');
  console.log('📊 טענו את אתר בקישור http://localhost:3000');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
