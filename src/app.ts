import express from 'express';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import dotenv from 'dotenv';
import { apiLimiter } from './middlewares/rateLimiter.middleware';
import { specs } from './docs/swagger';

const app = express();

dotenv.config();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/v1', apiLimiter, routes);

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
  });
});

export default app;
