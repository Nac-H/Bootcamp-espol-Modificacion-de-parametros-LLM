import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from '@/routes';
import { createLogger } from '@/utils/logger';

const logger = createLogger(import.meta.url);

export const createApp = (): express.Application => {
  const app = express();

  // Security middlewares
  app.use(helmet());
  app.use(cors());
  app.use(compression());

  // Logging
  app.use(
    morgan('combined', {
      stream: { write: (message: string) => logger.info(message.trim()) },
    })
  );

  // Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  app.get('/status', (req, res) => {
    res.json({
      service: 'llm-server',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // API routes
  app.use('/api', apiRoutes);

  // Error handler
  app.use(
    (
      error: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      logger.error('Unhandled error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'Something went wrong',
      });
    }
  );

  return app;
};
