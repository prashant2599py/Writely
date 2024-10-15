import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@plodhi/medium-common";
import { getCookie } from "hono/cookie";

export const blogRouter = new Hono<{
    Bindings : {
        DATABASE_URL : string;
        JWT_SECRET : string;
    },
    Variables : {
        userId : string;
    }
}>();

blogRouter.options('/*', (c) => {
  c.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  c.header('Access-Control-Allow-Credentials', 'true');
  c.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  return c.text('', 204); // Send a 204 No Content response
});
const prisma = new PrismaClient().$extends(withAccelerate());

// blogRouter.use("/*",async (c, next)=> {
//     const authHeader = c.req.header("Authorization") || "";
//     // const token = authHeader.split('')[1];
//     // console.log(token);
//     const jwtSecret = process.env.JWT_SECRET as string;
//     const user = await verify(authHeader, jwtSecret)

//     try{
//         if(user){
//             // c.set("userId" , user.id)
//             c.set("userId" , user.id as string)
//             await next();
//         }else{
//             c.status(403);
//             return c.json({
//                 message : "You are not logged In"
//             })
//         }
//     }catch(e){
//         c.status(403);
//         return c.json({
//             message : "You are not logged in"
//         })
//     }
// })
// Todo : add Pagination
blogRouter.get('/bulk', async (c) => {
    c.header('Access-Control-Allow-Origin', 'http://localhost:5173')
    console.log("In blog bulk route")

    // Get token from cookies
    const token = getCookie(c, 'token');
    console.log("Token in blog route : " + token);
    if(!token){
        c.status(401);
        return c.json({
            message : "Unauthorized"
        })
    }
    try{
        const jwtSecret  = process.env.JWT_SECRET as string
        const decoded = await verify(token, jwtSecret)
        // console.log( "decoded jwt : " + JSON.stringify(decoded));     

        if (!decoded) {
            throw new Error('Invalid token');
        }
        const blogs = await prisma.blog.findMany({
            select : {
                content: true,
                title: true,
                id: true,
                createdAt : true,
                author : {
                    select : {
                        name : true
                    }
                },
            }
        });
        return c.json({
            blogs
        })
        
    }catch(err){
        c.status(403);
        return c.json({
            message : "Catch error Unauthorized"
        })
    }   
})

blogRouter.post('/post', async (c) => {
    // console.log("In blog Post route")
    const auth  = getCookie(c,'token')
    const body = await c.req.json();
    const user = await verify(auth as string, process.env.JWT_SECRET as string);
    const { success } = createBlogInput.safeParse(body);

    if(!success){
        c.status(411);
        return c.json({
            message : "Inputs are not correct"
        })
    }

    if(user){
        c.set('userId', user.id as string);
    }else{
        c.status(403);
        return c.json({
            message: "You are not logged in"
        })
    }
    const authorId  = c.get("userId");

    const blog = await prisma.blog.create({
        data : {
            title : body.title,
            content : body.content,
            authorId : Number(authorId)
        }
    })
    return c.json({
        message : "Blog Created Successfully",
        id : blog.id
    })
  })
  
blogRouter.put('/update', async (c) => {
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);

    if(!success){
        c.status(411);
        return c.json({
            message : "Inputs are not correct"
        })
    }
    const blog = await prisma.blog.update({
        where : {
            id : body.id
        },
        data : {
            title : body.title,
            content : body.content,
        }
    })
    return c.json({
        id : blog.id,
        message :" Updated Post successfully"
    })
})

blogRouter.get('/:id', async (c) => {
    const id = c.req.param("id");

    try{
        const blog = await prisma.blog.findFirst({
            where : {
                id : Number(id)
            },
            select : {
                id: true,
                title: true,
                content : true,
                createdAt: true,
                author : {
                    select : {
                        name : true
                    }
                }
            }
        })
    
        return c.json({
            blog
        })
    }catch(e){
        c.status(411);
        return c.json({
            message : "Error while fetching the post"
        })
    }
})

