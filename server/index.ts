import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import recipesRouter from './routes/recipes.js';
import authRouter from './routes/auth.js';
import { notFoundHandler, errorHandler } from './middleware/errors.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// Middleware
// ============================================

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// ============================================
// Routes
// ============================================

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

app.use('/api/recipes', recipesRouter);
app.use('/api/auth', authRouter);

// ============================================
// Error Handling
// ============================================

// 404 handler for API routes  
app.all('/api/{*splat}', notFoundHandler);
app.use(errorHandler);

// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
