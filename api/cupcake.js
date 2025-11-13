import mongoose from 'mongoose';

const DATABASE_URL = process.env.DATABASE_URL;

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(DATABASE_URL, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

const CupcakeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  available: { type: Boolean, default: true },
});

const Cupcake = mongoose.models.Cupcake || mongoose.model('Cupcake', CupcakeSchema);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    await connectDB();
    
    const cupcakes = await Cupcake.find({ available: true });
    
    res.json(cupcakes);
  } catch (error) {
    console.error('❌ Error fetching cupcakes:', error);
    res.status(500).json({ message: 'Erro ao buscar cupcakes' });
  }
}