require("dotenv").config();
import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import { signupInput, signinInput } from "@plodhi/medium-common";
import {  setCookie }  from 'hono/cookie'
import { Record } from "@prisma/client/runtime/library";


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

    try{
      const user = await prisma.user.create({
        data : {
          name : body.name,
          username : body.username,
          password :body.password
        }
      })
      // console.log(process.env.JWT_SECRET);
      if(!process.env.JWT_SECRET){
        c.json({
          message : "Jwt secret is required"
        })
      }
      const jwtSecret = process.env.JWT_SECRET as string;
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

  // const remappedAuth = c.req.header('x-amzn-remapped-authorization');
  // const header = { ...c.req.header} as Record<string, string>;
  // if(remappedAuth){
  //   header['Authorization'] = remappedAuth;
  // }
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
          password :body.password
        }
      })
    
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
