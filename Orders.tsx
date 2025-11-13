// db.ts - CORRIGIDO SEM ERROS TYPESCRIPT
import mongoose from "mongoose";
import React, { useState } from "react";

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
  role: "user" | "admin";
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
  status: "pending" | "confirmed" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}

// 3. Definir os Schemas
const UserSchema = new mongoose.Schema<IUser>(
  {
    openId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    loginMethod: { type: String, default: "email" },
    lastSignedIn: { type: Date, default: Date.now },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true,
  }
);

const CupcakeSchema = new mongoose.Schema<ICupcake>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, default: "artesanal" },
    available: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const OrderItemSchema = new mongoose.Schema<IOrderItem>({
  cupcakeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cupcake",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    items: [OrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "confirmed", "delivered"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// 4. Models com tipagem correta
const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
const CupcakeModel =
  (mongoose.models.Cupcake as mongoose.Model<ICupcake>) ||
  mongoose.model<ICupcake>("Cupcake", CupcakeSchema);
const OrderModel =
  (mongoose.models.Order as mongoose.Model<IOrder>) ||
  mongoose.model<IOrder>("Order", OrderSchema);

export const User = UserModel;
export const Cupcake = CupcakeModel;
export const Order = OrderModel;

// 5. Funções de Acesso a Dados (CRUD)

// Usuários
export async function upsertUser(
  user: Partial<IUser> & { openId: string }
): Promise<IUser | null> {
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
        role: updateFields.role || "user",
      },
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
    loginMethod: "email",
    role: "user",
  });

  await user.save();
  return user.toObject();
}

// Cupcakes
export async function getAllCupcakes(): Promise<ICupcake[]> {
  await connectDb();
  const cupcakes = await CupcakeModel.find().sort({ name: 1 });
  return cupcakes.map((cupcake) => cupcake.toObject());
}

export async function getCupcakeById(id: string): Promise<ICupcake | null> {
  await connectDb();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const cupcake = await CupcakeModel.findById(id);
  return cupcake ? cupcake.toObject() : null;
}

// Popular dados iniciais de cupcakes
export async function seedCupcakes(): Promise<{
  message: string;
  count: number;
}> {
  await connectDb();

  const cupcakes = [
    {
      name: "Cupcake de Framboesa",
      description:
        "Massa de baunilha com recheio cremoso de framboesa e cobertura de chantilly",
      price: 10.2,
      imageUrl:
        "https://images.unsplash.com/photo-1598887142487-9933028ed929?w=400&h=400&fit=crop",
      available: true,
    },
    {
      name: "Cupcake de Caramelo Salgado",
      description:
        "Massa de caramelo com toque salgado e cobertura de creme e flor de sal",
      price: 11.3,
      imageUrl:
        "https://images.unsplash.com/photo-1556911220-e15b29be8c17?w=400&h=400&fit=crop",
      available: true,
    },
    {
      name: "Cupcake de Pistache",
      description:
        "Massa de pistache com cobertura de cream-cheese e pistaches picados",
      price: 12.0,
      imageUrl:
        "https://images.unsplash.com/photo-1559599189-578d4a3c94de?w=400&h=400&fit=crop",
      available: true,
    },
    {
      name: "Cupcake de Baunilha com Frutas Vermelhas",
      description:
        "Massa de baunilha com mix de frutas vermelhas e frosting de frutas",
      price: 10.9,
      imageUrl:
        "https://images.unsplash.com/photo-1563805042-7684e8d2ce8d?w=400&h=400&fit=crop",
      available: true,
    },
    {
      name: "Cupcake Vegano de Chocolate",
      description:
        "Massa de chocolate vegana com ganache de coco e granulado crunchy",
      price: 13.5,
      imageUrl:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
      available: true,
    },
    {
      name: "Cupcake de Amora",
      description:
        "Massa leve com amora fresca e cobertura de cream-cheese suave",
      price: 10.8,
      imageUrl:
        "https://images.unsplash.com/photo-1601924638867-3ecdf11c8844?w=400&h=400&fit=crop",
      available: true,
    },
    {
      name: "Cupcake de Menta com Chocolate",
      description:
        "Massa de chocolate com essência de menta e cobertura de ganache fria",
      price: 12.2,
      imageUrl:
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop",
      available: true,
    },
    {
      name: "Cupcake de Laranja com Amêndoas",
      description:
        "Massa de laranja siciliana com amêndoas laminadas e glacê cítrico",
      price: 11.0,
      imageUrl:
        "https://images.unsplash.com/photo-1559628237-3f9e4bd8674d?w=400&h=400&fit=crop",
      available: true,
    },
    {
      name: "Cupcake de Frutas Tropicais",
      description:
        "Mix de mangas, abacaxi e maracujá em massa leve e cobertura de coco",
      price: 11.7,
      imageUrl:
        "https://images.unsplash.com/photo-1585238342022-12ec0f5c8e06?w=400&h=400&fit=crop",
      available: true,
    },
    {
      name: "Cupcake de Carrot Cake",
      description:
        "Massa de cenoura com nozes, especiarias e cobertura de cream-cheese",
      price: 10.9,
      imageUrl:
        "https://images.unsplash.com/photo-1566736766626-ff14760c4603?w=400&h=400&fit=crop",
      available: true,
    },
    {
      name: "Cupcake de Limão e Blueberry",
      description: "Massa cítrica com blueberries e cobertura suave de limão",
      price: 11.5,
      imageUrl:
        "https://images.unsplash.com/photo-1495214783159-3503fd1f9e1b?w=400&h=400&fit=crop",
      available: true,
    },
    {
      name: "Cupcake de Maple com Bacon",
      description:
        "Massa doce de maple com bacon crocante por cima — doce + salgado",
      price: 13.0,
      imageUrl:
        "https://images.unsplash.com/photo-1512511708754-3a8f41b88438?w=400&h=400&fit=crop",
      available: true,
    },
    {
      name: "Cupcake de Doce de Leite com Nozes",
      description:
        "Massa de baunilha recheada com doce de leite e cobertura com nozes caramelizadas",
      price: 12.8,
      imageUrl:
        "https://images.unsplash.com/photo-1552521579-21309f6e2c20?w=400&h=400&fit=crop",
      available: true,
    },
    {
      name: "Cupcake de Cheesecake de Morango",
      description:
        "Massa tipo cheesecake com morangos frescos e cobertura de geléia de morango",
      price: 13.2,
      imageUrl:
        "https://images.unsplash.com/photo-1579532539734-d77d648a0f64?w=400&h=400&fit=crop",
      available: true,
    },
    {
      name: "Cupcake de Lavanda com Limão",
      description:
        "Massa suave de lavanda, toque de limão e cobertura aromática",
      price: 12.5,
      imageUrl:
        "https://images.unsplash.com/photo-1523986371872-9d3ba2e2fce3?w=400&h=400&fit=crop",
      available: true,
    },
    {
      name: "Cupcake de Oreo",
      description:
        "Massa de baunilha com pedaços de Oreo e cobertura de chantilly de Oreo",
      price: 11.9,
      imageUrl:
        "https://images.unsplash.com/photo-1559628283-f8c8e8c37d82?w=400&h=400&fit=crop",
      available: true,
    },
    {
      name: "Cupcake de Banana com Canela",
      description:
        "Massa de banana madura, canela e cobertura de cream-cheese leve",
      price: 10.7,
      imageUrl:
        "https://images.unsplash.com/photo-1562007905-7af8f0c3d776?w=400&h=400&fit=crop",
      available: true,
    },
    {
      name: "Cupcake de Damasco e Amêndoas",
      description:
        "Massa com damascos secos, amêndoas e cobertura de amêndoas laminadas",
      price: 11.4,
      imageUrl:
        "https://images.unsplash.com/photo-1484981138541-3d074aa97716?w=400&h=400&fit=crop",
      available: true,
    },
    {
      name: "Cupcake de Mirtilo (Blueberry)",
      description:
        "Massa de baunilha com mirtilos frescos e cobertura de creme leve",
      price: 10.9,
      imageUrl:
        "https://images.unsplash.com/photo-1521302080374-3b1e913a5b1e?w=400&h=400&fit=crop",
      available: true,
    },
    {
      name: "Cupcake de Marshmallow Torrado",
      description:
        "Massa de baunilha com marshmallow torrado por cima e toques de caramelo",
      price: 12.3,
      imageUrl:
        "https://images.unsplash.com/photo-1580657012822-0f41c2b623c3?w=400&h=400&fit=crop",
      available: true,
    },
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
      console.error(
        `❌ Erro ao adicionar cupcake "${cupcakeData.name}":`,
        error
      );
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
  const order = await OrderModel.findById(id).populate("items.cupcakeId");
  return order ? order.toObject() : null;
}

export async function getUserOrders(userId: string): Promise<IOrder[]> {
  await connectDb();
  if (!mongoose.Types.ObjectId.isValid(userId)) return [];
  const orders = await OrderModel.find({
    userId: new mongoose.Types.ObjectId(userId),
  }).sort({ createdAt: -1 });
  return orders.map((order) => order.toObject());
}
