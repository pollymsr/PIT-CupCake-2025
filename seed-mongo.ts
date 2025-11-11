import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb+srv://popollymsr_db_user:hAFQUYBwzB7tq8A9@cluster0.k0obyd5.mongodb.net/?appName=Cluster0';

async function run() {
  await mongoose.connect(DATABASE_URL);
  
  // Use os modelos do seu models.ts atual
  const { Cupcake } = await import('./models');
  
  const count = await Cupcake.countDocuments();
  if (count === 0) {
    console.log('Seeding sample cupcakes...');
    await Cupcake.create([
      { 
        name: 'Cupcake de Baunilha', 
        description: 'Macio e leve', 
        price: 9.9, 
        imageUrl: '/images/vanilla.jpg', 
        available: true 
      },
      { 
        name: 'Cupcake de Chocolate', 
        description: 'Intenso e cremoso', 
        price: 11.5, 
        imageUrl: '/images/chocolate.jpg', 
        available: true 
      },
      { 
        name: 'Cupcake Red Velvet', 
        description: 'Clássico red velvet', 
        price: 12.0, 
        imageUrl: '/images/redvelvet.jpg', 
        available: true 
      }
    ]);
    console.log('Seeding finished.');
  } else {
    console.log('Cupcakes already present, skipping seed.');
  }
  
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => { 
  console.error(err); 
  process.exit(1); 
});