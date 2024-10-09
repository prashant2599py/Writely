import dotenv from 'dotenv';
dotenv.config();
import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda';
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
import { cors } from 'hono/cors'

const app = new Hono();

app.use(cors({
  origin : 'http://localhost:5173',
  credentials: true,
  
}));
console.log('JWT_SECRET in start:', process.env.JWT_SECRET);


app.route("api/v1/user", userRouter);
app.route("api/v1/blog", blogRouter);

export const handler = handle(app);