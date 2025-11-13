// db.ts - VERSÃO SIMPLIFICADA SEM ERROS
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

// 2. Schemas sem tipagem complexa
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

// 3. Models com abordagem mais simples
let User: mongoose.Model<any>;
let Cupcake: mongoose.Model<any>;
let Order: mongoose.Model<any>;

try {
  User = mongoose.model('User');
} catch {
  User = mongoose.model('User', UserSchema);
}

try {
  Cupcake = mongoose.model('Cupcake');
} catch {
  Cupcake = mongoose.model('Cupcake', CupcakeSchema);
}

try {
  Order = mongoose.model('Order');
} catch {
  Order = mongoose.model('Order', OrderSchema);
}

export { User, Cupcake, Order };

// 4. Funções de Acesso a Dados - Versão Simplificada

// Usuários
export async function upsertUser(user: any): Promise<any> {
  await connectDb();
  const { openId, ...updateFields } = user;

  const result = await (User as any).findOneAndUpdate(
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
  return (User as any).findOne({ openId });
}

export async function getUserByEmail(email: string): Promise<any> {
  await connectDb();
  return (User as any).findOne({ email: email.toLowerCase() });
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
  return (Cupcake as any).find().sort({ name: 1 });
}

export async function getCupcakeById(id: string): Promise<any> {
  await connectDb();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return (Cupcake as any).findById(id);
}

// Popular dados iniciais de cupcakes
export async function seedCupcakes(): Promise<{ message: string; count: number }> {
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
    },
    {
      name: "Limão Siciliano",
      description: "Cupcake refrescante de limão siciliano",
      price: 11.50,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&q=80",
      category: "frutas"
    },
    {
      name: "Café Especial",
      description: "Cupcake com grãos de café especial",
      price: 12.50,
      image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=400&h=300&fit=crop&q=80",
      category: "especial"
    },
    {
      name: "Nutella Cremoso",
      description: "Cupcake com recheio cremoso de Nutella",
      price: 14.90,
      image: "https://images.unsplash.com/photo-1519861155730-0a1f0d5c4a8a?w=400&h=300&fit=crop&q=80",
      category: "chocolate"
    },
    {
      name: "Coco Tropical",
      description: "Cupcake com coco fresco e leite condensado",
      price: 12.90,
      image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&h=300&fit=crop&q=80",
      category: "tropical"
    }
  ];

  let successCount = 0;
  
  for (const cupcakeData of cupcakes) {
    try {
      await (Cupcake as any).findOneAndUpdate(
        { name: cupcakeData.name },
        cupcakeData,
        { upsert: true, new: true }
      );
      console.log(`✅ Cupcake "${cupcakeData.name}" adicionado/atualizado`);
      successCount++;
    } catch (error) {
      console.error(`❌ Erro ao adicionar cupcake "${cupcakeData.name}":`, error);
    }
  }
  
  console.log(`🎉 ${successCount} cupcakes foram populados no banco!`);
  return { message: "Cupcakes populados com sucesso!", count: successCount };
}

// Pedidos
export async function createOrder(orderData: { 
  userId: string; 
  userName: string; 
  totalAmount: number; 
  items: any[];
}): Promise<any> {
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
  return (Order as any).findById(id).populate('items.cupcakeId');
}

export async function getUserOrders(userId: string): Promise<any[]> {
  await connectDb();
  if (!mongoose.Types.ObjectId.isValid(userId)) return [];
  return (Order as any).find({ 
    userId: new mongoose.Types.ObjectId(userId) 
  }).sort({ createdAt: -1 });
}