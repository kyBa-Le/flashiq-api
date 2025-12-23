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

export default app;
