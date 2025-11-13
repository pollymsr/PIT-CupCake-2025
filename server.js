// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com MongoDB (use suas credenciais existentes)
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb+srv://popollymsr_db_user:hAFQUYBwzB7tq8A9@cluster0.k0obyd5.mongodb.net/pollyscupcakes?retryWrites=true&w=majority';

mongoose.connect(DATABASE_URL)
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => console.error('❌ Erro ao conectar MongoDB:', err));

// Models (baseado no seu models.ts)
const UserSchema = new mongoose.Schema({
  openId: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  loginMethod: { type: String, default: null },
  lastSignedIn: { type: Date, default: Date.now },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

// Rotas de Autenticação
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Este e-mail já está cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      openId: email,
      name,
      email,
      password: hashedPassword,
      loginMethod: 'email'
    });

    await user.save();

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    user.lastSignedIn = new Date();
    await user.save();

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastSignedIn: user.lastSignedIn
    };

    res.status(200).json({
      message: 'Login realizado com sucesso',
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});