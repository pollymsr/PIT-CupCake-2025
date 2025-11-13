// server.js (na raiz do projeto)
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Conexão com MongoDB
const DATABASE_URL = 'mongodb+srv://popollymsr_db_user:hAFQUYBwzB7tq8A9@cluster0.k0obyd5.mongodb.net/pollyscupcakes?retryWrites=true&w=majority';

mongoose.connect(DATABASE_URL)
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => console.error('❌ Erro ao conectar MongoDB:', err));

// Schema do User
const UserSchema = new mongoose.Schema({
  openId: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  loginMethod: { type: String, default: 'email' },
  lastSignedIn: { type: Date, default: Date.now },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

// Rotas
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
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
      password: hashedPassword
    });

    await user.save();

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
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
      role: user.role
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