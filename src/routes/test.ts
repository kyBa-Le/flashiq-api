import express = require('express');
const router = express.Router();
import { getUser } from '../app/controllers/user.controller';
import { login, register } from '../app/controllers/auth.controller';
import { verifyToken } from '../app/middlewares/auth.middleware';
router.get('/', verifyToken, getUser);
router.post('/register', register);
router.post('/login', login);
module.exports = router;