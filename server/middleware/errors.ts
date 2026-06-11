import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: 'הנתיב המבוקש לא נמצא',
  });
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('Server error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Prisma known errors
  if (err.constructor?.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as unknown as { code: string; meta?: Record<string, unknown> };
    
    if (prismaErr.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'הרשומה המבוקשת לא נמצאה',
      });
    }
    if (prismaErr.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: 'רשומה עם ערך זהה כבר קיימת',
      });
    }
  }

  // Zod validation errors
  if (err.constructor?.name === 'ZodError') {
    const zodErr = err as unknown as { issues: Array<{ message: string; path: (string | number)[] }> };
    return res.status(400).json({
      success: false,
      error: 'שגיאת ולידציה',
      details: zodErr.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      })),
    });
  }

  return res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'שגיאת שרת פנימית'
      : err.message,
  });
}
