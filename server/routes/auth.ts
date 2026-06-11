import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { generateToken, requireAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errors.js';
import { registerSchema, loginSchema, updatePreferencesSchema } from '../lib/validations/index.js';

const router = Router();

// ============================================
// POST /api/auth/register
// ============================================

router.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw new AppError(409, 'כתובת האימייל כבר רשומה במערכת');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
    });

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          preferredSystem: user.preferredSystem,
          language: user.language,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

// ============================================
// POST /api/auth/login
// ============================================

router.post('/login', async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.password) {
      throw new AppError(401, 'אימייל או סיסמה שגויים');
    }

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      throw new AppError(401, 'אימייל או סיסמה שגויים');
    }

    const token = generateToken({ userId: user.id, email: user.email });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          preferredSystem: user.preferredSystem,
          language: user.language,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

// ============================================
// GET /api/auth/me — Current user
// ============================================

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        preferredSystem: true,
        language: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'המשתמש לא נמצא');
    }

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// ============================================
// PUT /api/auth/me/preferences — Update prefs
// ============================================

router.put('/me/preferences', requireAuth, async (req, res, next) => {
  try {
    const data = updatePreferencesSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        preferredSystem: true,
        language: true,
      },
    });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

export default router;
