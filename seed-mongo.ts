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
    description: 'Massa de baunilha aromática com buttercream suave',
    price: 9.9,
    imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54ade99c7c3?w=400&h=400&fit=crop',
    available: true
  },
  {
    name: 'Cupcake de Chocolate Belga',
    description: 'Chocolate belga 70% com ganache intensa',
    price: 11.5,
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=400&fit=crop',
    available: true
  },
  {
    name: 'Red Velvet',
    description: 'Clássico red velvet com cream cheese frosting',
    price: 12.0,
    imageUrl: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&h=400&fit=crop',
    available: true
  },
  {
    name: 'Cupcake de Morango',
    description: 'Massa com pedaços de morango fresco e cobertura rosa',
    price: 10.5,
    imageUrl: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&h=400&fit=crop',
    available: true
  },
  {
    name: 'Cupcake de Limão Siciliano',
    description: 'Massa cítrica com glacê de limão e raspas',
    price: 9.9,
    imageUrl: 'https://images.unsplash.com/photo-1576618148400-9596041e2475?w=400&h=400&fit=crop',
    available: true
  },
  {
    name: 'Cupcake de Café',
    description: 'Massa de café com buttercream de baunilha',
    price: 11.0,
    imageUrl: 'https://images.unsplash.com/photo-1558308051-b7b35f9602de?w=400&h=400&fit=crop',
    available: true
  },
  {
    name: 'Cupcake de Coco',
    description: 'Massa de coco com frosting de coco queimado',
    price: 10.9,
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150725?w=400&h=400&fit=crop',
    available: true
  },
  {
    name: 'Cupcake Nutella',
    description: 'Recheio cremoso de Nutella com avelãs',
    price: 13.5,
    imageUrl: 'https://images.unsplash.com/photo-1596223575327-99a5cd16242f?w=400&h=400&fit=crop',
    available: true
  },
  {
    name: 'Cupcake de Matcha',
    description: 'Massa de chá verde japonês com frosting suave',
    price: 12.9,
    imageUrl: 'https://images.unsplash.com/photo-1558308051-5ac77252da73?w=400&h=400&fit=crop',
    available: true
  },
  {
    name: 'Cupcake Cookies & Cream',
    description: 'Massa de chocolate com pedaços de cookie',
    price: 11.9,
    imageUrl: 'https://images.unsplash.com/photo-1587668278277-295251f900ce?w=400&h=400&fit=crop',
    available: true
  },
  {
    name: 'Cupcake de Maracujá',
    description: 'Massa tropical com recheio azedinho de maracujá',
    price: 10.9,
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=400&fit=crop&crop=center',
    available: true
  },
  {
    name: 'Cupcake Especial da Casa',
    description: 'Nosso signature com múltiplas camadas de sabor',
    price: 14.9,
    imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e6170f67?w=400&h=400&fit=crop',
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