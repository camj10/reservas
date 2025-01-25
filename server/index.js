import express from 'express';
import router from './routes/routes.js';
import cors from 'cors';

const app = express();
app.use(cors({
  origin: 'http://localhost:3001', 
  methods: ['POST', 'GET', 'DELETE', 'PUT']
}));
app.use(express.json());
app.use('/api', router);
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
