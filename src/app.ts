import express from 'express';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import dotenv from 'dotenv';
import { apiLimiter } from './middlewares/rateLimiter.middleware';
import { specs } from './docs/swagger';
import { corsConfig } from './config/cors';
import { globalExceptionHandler } from './middlewares/exceptionHadler.middleware';

const app = express();

dotenv.config();

app.use(express.json());

app.use(corsConfig());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/v1', apiLimiter, routes);

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
  });
});

app.use(globalExceptionHandler);

export default app;
