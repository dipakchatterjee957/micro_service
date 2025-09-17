// index.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import userLoginService  from './src/service/userLoginEvent.service.js';
dotenv.config();

const app = express();


// Mongo connection
const mongoUrl = process.env.DATABASE_URL || 'mongodb://root:1234@mongodb:27017/audit_db?authSource=admin';
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB audit_db');
    userLoginService.startUserLoginConsumer();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Optional health check endpoint
app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Audit service running on port ${PORT}`));
