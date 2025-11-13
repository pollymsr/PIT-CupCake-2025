// db.ts - CORRIGIDO SEM ERROS TYPESCRIPT
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

// 2. Interfaces TypeScript
interface IUser {
  _id?: mongoose.Types.ObjectId;
  openId: string;
  name: string;
  email: string;
  password: string;
  loginMethod: string;
  lastSignedIn: Date;
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

interface ICupcake {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IOrderItem {
  cupcakeId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

interface IOrder {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  totalAmount: number;
  items: IOrderItem[];
  status: 'pending' | 'confirmed' | 'delivered';
  createdAt?: Date;
  updatedAt?: Date;
}

// 3. Definir os Schemas
const UserSchema = new mongoose.Schema<IUser>({
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

const CupcakeSchema = new mongoose.Schema<ICupcake>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, default: 'artesanal' },
  available: { type: Boolean, default: true }
}, { 
  timestamps: true 
});

const OrderItemSchema = new mongoose.Schema<IOrderItem>({
  cupcakeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cupcake', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema<IOrder>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  items: [OrderItemSchema],
  status: { type: String, enum: ['pending', 'confirmed', 'delivered'], default: 'pending' }
}, { 
  timestamps: true 
});

// 4. Models com tipagem correta
const UserModel = mongoose.models.User as mongoose.Model<IUser> || mongoose.model<IUser>('User', UserSchema);
const CupcakeModel = mongoose.models.Cupcake as mongoose.Model<ICupcake> || mongoose.model<ICupcake>('Cupcake', CupcakeSchema);
const OrderModel = mongoose.models.Order as mongoose.Model<IOrder> || mongoose.model<IOrder>('Order', OrderSchema);

export const User = UserModel;
export const Cupcake = CupcakeModel;
export const Order = OrderModel;

// 5. Funções de Acesso a Dados (CRUD)

// Usuários
export async function upsertUser(user: Partial<IUser> & { openId: string }): Promise<IUser | null> {
  await connectDb();
  const { openId, ...updateFields } = user;

  const result = await UserModel.findOneAndUpdate(
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
  return UserModel.findOne({ openId });
}

export async function getUserByEmail(email: string): Promise<IUser | null> {
  await connectDb();
  return UserModel.findOne({ email: email.toLowerCase() });
}

export async function createUserWithPassword(userData: {
  name: string;
  email: string;
  password: string;
}): Promise<IUser> {
  await connectDb();
  
  const user = new UserModel({
    openId: userData.email,
    name: userData.name,
    email: userData.email,
    password: userData.password,
    loginMethod: 'email',
    role: 'user'
  });

  await user.save();
  return user.toObject();
}

// Cupcakes
export async function getAllCupcakes(): Promise<ICupcake[]> {
  await connectDb();
  const cupcakes = await CupcakeModel.find().sort({ name: 1 });
  return cupcakes.map(cupcake => cupcake.toObject());
}

export async function getCupcakeById(id: string): Promise<ICupcake | null> {
  await connectDb();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const cupcake = await CupcakeModel.findById(id);
  return cupcake ? cupcake.toObject() : null;
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
      await CupcakeModel.findOneAndUpdate(
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
  items: IOrderItem[];
}): Promise<IOrder> {
  await connectDb();
  const order = new OrderModel({
    ...orderData,
    userId: new mongoose.Types.ObjectId(orderData.userId),
  });
  await order.save();
  return order.toObject();
}

export async function getOrderById(id: string): Promise<IOrder | null> {
  await connectDb();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const order = await OrderModel.findById(id).populate('items.cupcakeId');
  return order ? order.toObject() : null;
}

export async function getUserOrders(userId: string): Promise<IOrder[]> {
  await connectDb();
  if (!mongoose.Types.ObjectId.isValid(userId)) return [];
  const orders = await OrderModel.find({ 
    userId: new mongoose.Types.ObjectId(userId) 
  }).sort({ createdAt: -1 });
  return orders.map(order => order.toObject());
}