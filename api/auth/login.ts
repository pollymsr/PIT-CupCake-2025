import { NextApiRequest, NextApiResponse } from 'next';
import { connectDb, getUserByEmail } from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
    }

    await connectDb();

    // Buscar usuário
    const user = await getUserByEmail(email);
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Atualizar último login
    user.lastSignedIn = new Date();
    await user.save();

    // Remover senha do retorno
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastSignedIn: user.lastSignedIn
    };

    res.status(200).json({
      message: 'Login realizado com sucesso',
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}