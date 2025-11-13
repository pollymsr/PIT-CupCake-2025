// db.js - SUBSTITUA O db.ts POR ESTE ARQUIVO
import mongoose from 'mongoose';

// Conexão com MongoDB
export async function connectDb() {
  if (mongoose.connection.readyState === 1) return;
  
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  
  await mongoose.connect(connectionString);
  console.log("[Database] Connected to MongoDB");
}

// Schemas básicos
const UserSchema = new mongoose.Schema({
  openId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  loginMethod: { type: String, default: 'email' },
  role: { type: String, default: 'user' }
}, { timestamps: true });

const CupcakeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, default: 'artesanal' },
  available: { type: Boolean, default: true }
}, { timestamps: true });

// Models
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Cupcake = mongoose.models.Cupcake || mongoose.model('Cupcake', CupcakeSchema);

// Funções principais
export async function getUserByEmail(email) {
  await connectDb();
  return User.findOne({ email: email.toLowerCase() });
}

export async function createUserWithPassword(userData) {
  await connectDb();
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

export async function getAllCupcakes() {
  await connectDb();
  return Cupcake.find().sort({ name: 1 });
}

export async function seedCupcakes() {
  await connectDb();
  
  const cupcakes = [
    {
      name: "Chocolate Belga",
      description: "Cupcake artesanal com chocolate belga premium",
      price: 12.90,
      image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop&q=80",
      category: "chocolate"
    },
    {
      name: "Morango Fresco",
      description: "Cupcake com recheio de morangos frescos",
      price: 11.90,
      image: "https://images.unsplash.com/photo-1551026941-874221147774?w=400&h=300&fit=crop&q=80",
      category: "frutas"
    },
    {
      name: "Baunilha Francesa",
      description: "Cupcake com essência de baunilha francesa",
      price: 10.90,
      image: "https://images.unsplash.com/photo-1576618148400-9596041e2475?w=400&h=300&fit=crop&q=80",
      category: "clássico"
    },
    {
      name: "Red Velvet",
      description: "Cupcake red velvet com cream cheese",
      price: 13.90,
      image: "https://images.unsplash.com/photo-1588195538326-c2b1e6170f67?w=400&h=300&fit=crop&q=80",
      category: "especial"
    }
  ];

  for (const data of cupcakes) {
    await Cupcake.findOneAndUpdate(
      { name: data.name },
      data,
      { upsert: true }
    );
  }
  
  return { message: "Cupcakes adicionados!", count: cupcakes.length };
}