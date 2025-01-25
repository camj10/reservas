import express from 'express';
import router from './routes/routes.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express(); 
app.use(cors({
  origin: `http://localhost:${process.env.PORTORIGIN}`, 
  methods: ['POST', 'GET', 'DELETE', 'PUT']
}));
app.use(express.json());
app.use('/api', router);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto: ${PORT}`);
});
