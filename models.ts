import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Interfaces para os documentos do MongoDB
export interface IUser extends Document {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  lastSignedIn: Date;
  role: 'user' | 'admin';
}

export interface ICupcake extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: Date;
}

export interface IOrderItem extends Document {
  orderId: mongoose.Types.ObjectId;
  cupcakeId: mongoose.Types.ObjectId;
  quantity: number;
  priceAtOrder: number;
}

// 2. Schemas do Mongoose
const UserSchema: Schema = new Schema({
  openId: { type: String, required: true, unique: true },
  name: { type: String, default: null },
  email: { type: String, default: null },
  loginMethod: { type: String, default: null },
  lastSignedIn: { type: Date, default: Date.now },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

const CupcakeSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  available: { type: Boolean, default: true },
});

const OrderSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const OrderItemSchema: Schema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  cupcakeId: { type: Schema.Types.ObjectId, ref: 'Cupcake', required: true },
  quantity: { type: Number, required: true },
  priceAtOrder: { type: Number, required: true },
});

// 3. Modelos do Mongoose
export const User = mongoose.model<IUser>('User', UserSchema);
export const Cupcake = mongoose.model<ICupcake>('Cupcake', CupcakeSchema);
export const Order = mongoose.model<IOrder>('Order', OrderSchema);
export const OrderItem = mongoose.model<IOrderItem>('OrderItem', OrderItemSchema);

// 4. Tipos de Inserção
export type InsertUser = Omit<IUser, '_id' | 'lastSignedIn' | 'role'> & Partial<Pick<IUser, 'lastSignedIn' | 'role'>>;
export type InsertCupcake = Omit<ICupcake, '_id'>;
export type InsertOrder = Omit<IOrder, '_id' | 'createdAt'> & Partial<Pick<IOrder, 'createdAt'>>;
export type InsertOrderItem = Omit<IOrderItem, '_id'>;