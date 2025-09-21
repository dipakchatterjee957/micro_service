import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6060;

// ----- Middlewares -----
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ----- Proxy Configs -----
const createServiceProxy = (target) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path, req) => path.replace(/^\/(user|invoice)/, ''),
    onProxyReq: (proxyReq, req) => {
      // Example: Add custom headers if needed
      // proxyReq.setHeader('x-gateway', 'api-gateway');
    },
  });

// Route prefixes → services
app.use('/user', createServiceProxy(process.env.USER_SERVICE_URL));
app.use('/invoice', createServiceProxy(process.env.INVOICE_SERVICE_URL));

// 404 handler
app.use((_, res) => res.status(404).json({ error: 'Not Found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Gateway Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () =>
  console.log(`🚀 API Gateway running at http://localhost:${PORT}`)
);
