import { getAllCupcakes, getCupcakeById, createOrder, getOrderById, getUserOrders } from "./db";
import mongoose from "mongoose";
import type { ICupcake, IOrder, IOrderItem, IUser } from "./models";

// Implementações simples para substituir os imports faltantes
const COOKIE_NAME = 'cupcake-session';

const getSessionCookieOptions = (req: any) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 365 * 24 * 60 * 60 * 1000
});

// Implementação básica do tRPC corrigida
const createProcedure = () => {
  return {
    query: (fn: any) => fn,
    mutation: (fn: any) => fn,
    input: (validator: any) => ({
      query: (fn: any) => fn,
      mutation: (fn: any) => fn
    })
  };
};

const publicProcedure = createProcedure();
const protectedProcedure = createProcedure();

const router = (routes: any) => routes;

const systemRouter = router({});

// Tipos para as respostas da API
interface ApiCupcake {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
}

interface ApiOrderItem {
  cupcakeId: string;
  cupcakeName: string;
  quantity: number;
  price: number;
}

interface ApiOrder {
  _id: string;
  userId: string;
  status: string;
  totalAmount: number;
  items: ApiOrderItem[];
  createdAt: string;
}

// Helper functions para lidar com documentos Mongoose
const toApiCupcake = (cupcake: ICupcake): ApiCupcake => ({
  _id: (cupcake as any)._id?.toString() || '',
  name: cupcake.name,
  description: cupcake.description,
  price: cupcake.price,
  imageUrl: cupcake.imageUrl || 'default-cupcake.png',
  available: cupcake.available
});

const toApiOrder = (order: IOrder): ApiOrder => {
  const orderObj = order.toObject ? order.toObject() : order;
  return {
    _id: (orderObj as any)._id?.toString() || '',
    userId: (orderObj as any).userId?.toString() || '',
    status: orderObj.status,
    totalAmount: orderObj.totalAmount,
    createdAt: orderObj.createdAt?.toISOString() || new Date().toISOString(),
    items: ((orderObj as any).items || []).map((item: any) => ({
      cupcakeId: item.cupcakeId?.toString() || '',
      cupcakeName: item.cupcakeName || 'Cupcake',
      quantity: item.quantity,
      price: item.priceAtOrder || item.price
    }))
  };
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts: any) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }: any) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  cupcakes: router({
    list: publicProcedure.query(async (): Promise<ApiCupcake[]> => {
      const cupcakes = await getAllCupcakes();
      return cupcakes.map(toApiCupcake);
    }),
    
    get: publicProcedure
      .input((input: any) => input.id as string)
      .query(async ({ input }: any): Promise<ApiCupcake | null> => {
        const cupcake = await getCupcakeById(input);
        if (!cupcake) return null;
        return toApiCupcake(cupcake);
      }),
  }),

  orders: router({
    create: protectedProcedure
      .input((input: any) => input as {
        items: { id: string, quantity: number, price: number, name: string }[],
        total: number,
        paymentMethod: string,
        customerName: string,
        customerEmail: string,
        customerAddress: string,
        customerCity: string,
        customerZip: string,
      })
      .mutation(async ({ input, ctx }: any) => {
        if (!ctx.user || !(ctx.user as any)._id) {
          throw new Error("User not authenticated");
        }

        const orderItems = input.items.map((item: any) => ({
          cupcakeId: new mongoose.Types.ObjectId(item.id),
          quantity: item.quantity,
          priceAtOrder: item.price,
        }));

        const orderResult = await createOrder({
          userId: (ctx.user as any)._id.toString(),
          userName: input.customerName,
          totalAmount: input.total,
          items: orderItems,
        });

        return { 
          orderId: (orderResult as any)._id?.toString() || 'unknown', 
          status: (orderResult as any).status || 'pending'
        };
      }),

    list: protectedProcedure.query(async ({ ctx }: any): Promise<ApiOrder[]> => {
      if (!ctx.user || !(ctx.user as any)._id) return [];
      const orders = await getUserOrders((ctx.user as any)._id.toString());
      
      return orders.map(order => toApiOrder(order as IOrder));
    }),

    get: protectedProcedure
      .input((input: any) => input.id as string)
      .query(async ({ input, ctx }: any): Promise<ApiOrder | null> => {
        if (!ctx.user || !(ctx.user as any)._id) {
          throw new Error("User not authenticated");
        }

        const order = await getOrderById(input);

        if (!order || (order as any).userId?.toString() !== (ctx.user as any)._id.toString()) {
          throw new Error("Order not found or unauthorized");
        }

        return toApiOrder(order as IOrder);
      }),
  }),
});

export type AppRouter = typeof appRouter;