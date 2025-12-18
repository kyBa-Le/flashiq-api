import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import routes from './routes';
import dotenv from 'dotenv';
import { apiLimiter } from './middlewares/rateLimiter';

const app = express();

dotenv.config();

const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', apiLimiter, routes);

export default app;
