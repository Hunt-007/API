const express = require('express');
const cookieParser = require('cookie-parser');

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const protectedRoutes = require('./routes/protected.routes');
const userRoutes = require('./routes/user.routes'); // 👈 FALTA ESTO

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api', healthRoutes);
app.use('/api', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api', userRoutes); // 👈 Y ESTO

module.exports = app;
