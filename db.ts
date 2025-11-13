// db.ts - ATUALIZADO
import mongoose from 'mongoose';
import { User, IUser, Cupcake, ICupcake, Order, IOrder, OrderItem, IOrderItem } from './models';

// 1. Conexão com o Banco de Dados
export async function connectDb() {
  if (mongoose.connection.readyState === 1) {
    console.log("[Database] Already connected.");
    return;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set. Cannot connect to MongoDB.");
    return;
  }

  try {
    await mongoose.connect(connectionString);
    console.log("[Database] Connected to MongoDB successfully.");
  } catch (error) {
    console.error("[Database] Failed to connect to MongoDB:", error);
  }
}

// 2. Funções de Acesso a Dados (CRUD)

// Usuários
export async function upsertUser(user: Partial<IUser> & { openId: string }): Promise<IUser | null> {
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

export async function getUserByOpenId(openId: string): Promise<IUser | null> {
  await connectDb();
  return User.findOne({ openId });
}

// NOVA FUNÇÃO: Buscar usuário por email
export async function getUserByEmail(email: string): Promise<IUser | null> {
  await connectDb();
  return User.findOne({ email: email.toLowerCase() });
}

// NOVA FUNÇÃO: Criar usuário com senha
export async function createUserWithPassword(userData: {
  name: string;
  email: string;
  password: string;
}): Promise<IUser> {
  await connectDb();
  
  const user = new User({
    openId: userData.email, // Usando email como openId
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
export async function getAllCupcakes(): Promise<ICupcake[]> {
  await connectDb();
  return Cupcake.find().sort({ name: 1 });
}

export async function getCupcakeById(id: string): Promise<ICupcake | null> {
  await connectDb();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Cupcake.findById(id);
}

// Pedidos
export async function createOrder(orderData: { userId: string, userName: string, totalAmount: number, items: IOrderItem[] }): Promise<IOrder> {
  await connectDb();
  const order = new Order({
    ...orderData,
    userId: new mongoose.Types.ObjectId(orderData.userId),
  });
  await order.save();
  return order;
}

export async function getOrderById(id: string): Promise<IOrder | null> {
  await connectDb();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Order.findById(id).populate('items.cupcakeId');
}

export async function getUserOrders(userId: string): Promise<IOrder[]> {
  await connectDb();
  if (!mongoose.Types.ObjectId.isValid(userId)) return [];
  return Order.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
}