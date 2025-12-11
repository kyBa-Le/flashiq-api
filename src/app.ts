const express = require('express');
const app = express();
const router = require ('./routes/index.ts');
app.use(express.json());
router(app)

module.exports = app;
