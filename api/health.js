export default async function handler(req, res) {
  res.status(200).json({ 
    status: 'OK', 
    message: 'API Polly\'s Cupcakes está funcionando!',
    timestamp: new Date().toISOString()
  });
}