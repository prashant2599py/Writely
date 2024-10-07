import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@plodhi/medium-common";

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

blogRouter.use("/*",async (c, next)=> {
    const authHeader = c.req.header("Authorization") || "";
    const jwtSecret = process.env.JWT_SECRET as string;
    const user = await verify(authHeader, jwtSecret)

    try{
        if(user){
            // c.set("userId" , user.id)
            c.set("userId" , user.id as string)
            await next();
        }else{
            c.status(403);
            return c.json({
                message : "You are not logged In"
            })
        }
    }catch(e){
        c.status(403);
        return c.json({
            message : "You are not logged in"
        })
    }
})

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);

    if(!success){
        c.status(411);
        return c.json({
            message : "Inputs are not correct"
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
        id : blog.id
    })
  })
  
blogRouter.put('/', async (c) => {
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
        id : blog.id
    })
})

// Todo : add Pagination
blogRouter.get('/bulk', async (c) => {
    c.header('Access-Control-Allow-Origin', 'http://localhost:5173')
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
    // console.log(blogs)

    return c.json({
        blogs
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

