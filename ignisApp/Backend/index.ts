import { connectDB } from './Config/db';

connectDB();
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ping', (_req, res) => {
  res.json({ message: 'Backend funcionando!' });
});

app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
``