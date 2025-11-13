// db.ts - CORRIGIDO
import mongoose from 'mongoose';

// 1. Conexão com o Banco de Dados
export async function connectDb() {
  if (mongoose.connection.readyState === 1) {
    console.log("[Database] Already connected.");
    return;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set. Cannot connect to MongoDB.");
    throw new Error("DATABASE_URL is not set");
  }

  try {
    await mongoose.connect(connectionString);
    console.log("[Database] Connected to MongoDB successfully.");
  } catch (error) {
    console.error("[Database] Failed to connect to MongoDB:", error);
    throw error;
  }
}

// 2. Definir os Schemas aqui mesmo (simplificado)
const UserSchema = new mongoose.Schema({
  openId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  loginMethod: { type: String, default: 'email' },
  lastSignedIn: { type: Date, default: Date.now },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { 
  timestamps: true 
});

const CupcakeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, default: 'artesanal' },
  available: { type: Boolean, default: true }
}, { 
  timestamps: true 
});

const OrderItemSchema = new mongoose.Schema({
  cupcakeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cupcake', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  items: [OrderItemSchema],
  status: { type: String, enum: ['pending', 'confirmed', 'delivered'], default: 'pending' }
}, { 
  timestamps: true 
});

// Models
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Cupcake = mongoose.models.Cupcake || mongoose.model('Cupcake', CupcakeSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// 3. Funções de Acesso a Dados (CRUD)

// Usuários
export async function upsertUser(user: any): Promise<any> {
  await connectDb();
  const { openId, ...updateFields } = user;

  const result = await User.findOneAndUpdate(
    { openId },
    {
      $set: {
        ...updateFields,
        lastSignedIn: new Date(),
      },
      $setOnInsert: {
        openId,
        role: updateFields.role || 'user',
      }
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );
  return result;
}

export async function getUserByOpenId(openId: string): Promise<any> {
  await connectDb();
  return User.findOne({ openId });
}

export async function getUserByEmail(email: string): Promise<any> {
  await connectDb();
  return User.findOne({ email: email.toLowerCase() });
}

export async function createUserWithPassword(userData: {
  name: string;
  email: string;
  password: string;
}): Promise<any> {
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

// Cupcakes
export async function getAllCupcakes(): Promise<any[]> {
  await connectDb();
  return Cupcake.find().sort({ name: 1 });
}

export async function getCupcakeById(id: string): Promise<any> {
  await connectDb();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Cupcake.findById(id);
}

// Popular dados iniciais de cupcakes
export async function seedCupcakes() {
  await connectDb();
  
  const cupcakes = [
    {
      name: "Chocolate Belga",
      description: "Cupcake artesanal com chocolate belga premium",
      price: 12.90,
      image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300&h=300&fit=crop&q=80",
      category: "chocolate"
    },
    {
      name: "Morango Fresco",
      description: "Cupcake com recheio de morangos frescos",
      price: 11.90,
      image: "https://unsplash.com/pt-br/fotografias/cupcake-com-cereja-rosa-por-cima-FAnSK-gVGZU",
      category: "frutas"
    },
    {
      name: "Baunilha Francesa",
      description: "Cupcake com essência de baunilha francesa",
      price: 10.90,
      image: "https://unsplash.com/pt-br/fotografias/um-monte-de-cupcakes-com-cobertura-branca-e-polvilho-07Z9Sgv_0cM",
      category: "clássico"
    },
    {
      name: "Red Velvet",
      description: "Cupcake red velvet com cream cheese",
      price: 13.90,
      image: "https://unsplash.com/pt-br/fotografias/cupcake-branco-e-vermelho-com-cereja-branca-por-cima-MJPr6nOdppw",
      category: "especial"
    },
    {
      name: "Limão Siciliano",
      description: "Cupcake refrescante de limão siciliano",
      price: 11.50,
      image: "https://unsplash.com/pt-br/fotografias/tampo-de-cupcake-com-creme-no-suporte-de-cupcake-amarelo-Ltv7a5m8i4c",
      category: "frutas"
    },
    {
      name: "Café Especial",
      description: "Cupcake com grãos de café especial",
      price: 12.50,
      image: "https://unsplash.com/pt-br/fotografias/close-up-fotografia-de-cupcakes-zk-fclJdGas",
      category: "especial"
    }
  ];

  for (const cupcake of cupcakes) {
    await Cupcake.findOneAndUpdate(
      { name: cupcake.name },
      cupcake,
      { upsert: true, new: true }
    );
  }
  
  console.log("✅ Cupcakes populados no banco!");
}

// Pedidos
export async function createOrder(orderData: { userId: string, userName: string, totalAmount: number, items: any[] }): Promise<any> {
  await connectDb();
  const order = new Order({
    ...orderData,
    userId: new mongoose.Types.ObjectId(orderData.userId),
  });
  await order.save();
  return order;
}

export async function getOrderById(id: string): Promise<any> {
  await connectDb();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Order.findById(id).populate('items.cupcakeId');
}

export async function getUserOrders(userId: string): Promise<any[]> {
  await connectDb();
  if (!mongoose.Types.ObjectId.isValid(userId)) return [];
  return Order.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
}