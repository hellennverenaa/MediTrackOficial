import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

console.log('🔄 Iniciando servidor...');

dotenv.config();
console.log('✅ Variáveis de ambiente carregadas');

const app = express();
const PORT = process.env.PORT || 3000;

console.log(`📌 Porta configurada: ${PORT}`);

// Middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // Permite qualquer origem (desenvolvimento)
  credentials: true
}));
app.use(express.json());

console.log('✅ Middlewares configurados');

// Health check
app.get('/health', (req, res) => {
  console.log('🏥 Health check chamado');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

console.log('✅ Rotas configuradas');

// Importar rotas depois
import { authRouter } from './routes/auth';
import { medicationRouter } from './routes/medications';
import { notificationRouter } from './routes/notifications';
import { errorHandler } from './middleware/errorHandler';

app.use('/api/auth', authRouter);
app.use('/api/medications', medicationRouter);
app.use('/api/notifications', notificationRouter);
app.use(errorHandler);

console.log('✅ Todas as rotas importadas');

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Acesse: http://localhost:${PORT}/health`);
});