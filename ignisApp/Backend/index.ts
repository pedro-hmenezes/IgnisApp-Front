import { connectDB } from './Config/db.js';
import express from 'express';
import cors from 'cors';

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API do IgnisApp está rodando!');
});

app.get('/api/ping', (_req, res) => {
  res.json({ message: 'Backend funcionando!' });
});

app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
