// db.js - ATUALIZADO COM VERIFICAÇÃO
import mongoose from 'mongoose';

// Verificar se está conectado
export function isConnected() {
  return mongoose.connection.readyState === 1;
}

export async function connectDb() {
  if (isConnected()) {
    console.log("[Database] Already connected.");
    return;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ DATABASE_URL is not set. Cannot connect to MongoDB.");
    throw new Error("DATABASE_URL is not set");
  }

  try {
    await mongoose.connect(connectionString);
    console.log("✅ [Database] Connected to MongoDB successfully.");
  } catch (error) {
    console.error("❌ [Database] Failed to connect to MongoDB:", error);
    throw error;
  }
}

// Defina o schema e model ANTES de exportar
const UserSchema = new mongoose.Schema({
  openId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  loginMethod: { type: String, default: 'email' },
  role: { type: String, default: 'user' }
}, { timestamps: true });

// Crie o model - IMPORTANTE: sem verificação condicional complexa
let UserModel;
try {
  UserModel = mongoose.model('User');
} catch {
  UserModel = mongoose.model('User', UserSchema);
}

export const User = UserModel;

// Funções com verificação de conexão
export async function getUserByEmail(email) {
  if (!isConnected()) {
    await connectDb();
  }
  return User.findOne({ email: email.toLowerCase() });
}

export async function createUserWithPassword(userData) {
  if (!isConnected()) {
    await connectDb();
  }
  
  const user = new User({
    openId: userData.email,
    name: userData.name,
    email: userData.email,
    password: userData.password,
    loginMethod: 'email',
    role: 'user'
  });
  
  await user.save();
  return user;
}