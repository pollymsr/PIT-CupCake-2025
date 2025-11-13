// api/seed-cupcakes.js
import { seedCupcakes } from '../db.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    console.log('🌱 Populando cupcakes no banco...');
    await seedCupcakes();
    res.status(200).json({ message: 'Cupcakes populados com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao popular cupcakes:', error);
    res.status(500).json({ 
      message: 'Erro ao popular cupcakes',
      error: error.message 
    });
  }
}