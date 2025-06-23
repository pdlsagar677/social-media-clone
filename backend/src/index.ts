import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());


app.get('/', (_req, res) => {
  res.send('🚀 Server running with TypeScript + Express!');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at${PORT}`);
});
