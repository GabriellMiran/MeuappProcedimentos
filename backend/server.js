require('dotenv').config();
const express = require('express');
const cors = require('cors');

const procedimentoRoutes = require('./routes/procedimentoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', procedimentoRoutes);
app.use('/api', usuarioRoutes);

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor rodando em 0.0.0.0:3000');
});
