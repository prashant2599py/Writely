require("dotenv").config();
import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import { signupInput, signinInput } from "@plodhi/medium-common";
import {  getCookie, setCookie }  from 'hono/cookie'
const bcrypt = require("bcrypt");


export const userRouter = new Hono();

userRouter.options('/*', (c) => {
  c.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  c.header('Access-Control-Allow-Credentials', 'true');
  c.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  
  return c.text('', 204); // Send a 204 No Content response
});

const prisma = new PrismaClient().$extends(withAccelerate())

userRouter.post('/signup', async (c) => {  
  const body = await c.req.json()
  const { success } = signupInput.safeParse(body);
    if(!success){
      c.status(411);
      return c.json({
        message : "Inputs are not correct"
      })
    }

    const password = body.password;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(password, salt)
    console.log(hashedPassword);
  
    try{
      const user = await prisma.user.create({
        data : {
          name : body.name,
          username : body.username,
          password : hashedPassword
        }
      })
      // console.log(process.env.JWT_SECRET);
      if(!process.env.JWT_SECRET){
        c.json({
          message : "Jwt secret is required"
        })
      }
      const jwtSecret = process.env.JWT_SECRET as string
      const jwt = await sign({
        id : user.id,
        name : user.name
      }, jwtSecret)

      // Set Headers
      c.header('Authorization', jwt);
      

      setCookie(c, 'token', jwt, {
        httpOnly : true,
        secure : true,
        sameSite: "None"
      });
      return c.json({
        message : "Signed up successfully",
      })

    }catch(err){
      console.log(err);
      
      c.status(411);
      return c.text('User already exists with this email');
    }  
})


userRouter.post('/signin', async (c) => { 
  if (!process.env.JWT_SECRET) {
    c.status(500);
    return c.json({ message: "JWT_SECRET is not defined" });
  }

  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);

  if(!success){
    c.status(401);
    return c.json({
      message : "Credentials are not correct"
    })
  }
  
  try{
    const user = await prisma.user.findFirst({
      where : {
        username : body.username,
        password : body.password
      }
    })
    const password = body.password;
    const afterHashedPassword = await bcrypt.compare(password, )
    console.log(afterHashedPassword);
    
      if(!user){

        c.status(403);
        return c.json({
          message : "Incorrect credentials"
        });    
      }
      const jwt = await sign({
        id : user.id,
        email : user.username,
      }, process.env.JWT_SECRET)

      c.header('Authorization', jwt);
      c.header('Access-Control-Expose-Headers', 'Authorization');  // Exposing the Authorization header

      setCookie(c,'token', jwt,{
        httpOnly: true,
        secure: true,
        sameSite: 'None'
      });
      return c.json({
        message : "Signed in Successfully",
      })

    }catch(err){
      console.error("Error during signin:", err);
      
    } 
})

userRouter.get('/me', async (c) => {
  // console.log("Inside /me route")
    const token = getCookie(c ,'token');

    if(!token){
      c.status(401);
      return c.json({
        message : "Unauthorized"
      })
    }
    try{
      const verified = await verify(token, process.env.JWT_SECRET as string);
      const user = await prisma.user.findUnique({
        where : {
          id : verified.id as number,
        }
      })
      if(!user){
        c.status(404);
        return c.json({message : "User not found"});
      }

      return c.json({user : {id : user?.id, name : user?.name}});

    }catch(err){
      c.status(403);
      return c.json({message : "Invalid Token"})
    }
})