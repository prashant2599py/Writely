import dotenv from 'dotenv'
dotenv.config();
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@plodhi/medium-common";
import { getCookie } from "hono/cookie";


import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";


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

const s3Client = new S3Client({
    region: "ap-south-1"
    
})

blogRouter.post("/upload", async (c) => {

    const body = await c.req.formData();
    const file = body.get('file');

    if (file && file instanceof File) {
        // Read the file as a buffer
        const fileBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(fileBuffer);
        
        const fileName = file.name;
        
        const params = {
            Bucket: process.env.S3_BUCKET_NAME as string,
            Body: buffer,
            Key: `uploads/${file.name}`,
            ContentType: "multipart/form-data"
        }
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        return c.json({
            "message": "File uploaded successfully",
            fileurl: `https://d1qi1e4y57otxy.cloudfront.net/uploads/${fileName}`
        })
    }
    return c.json({ error: 'No file uploaded' }, 400);  

})

blogRouter.post('/post', async (c) => {
    const auth  = getCookie(c,'token')
    const body = await c.req.json();
    console.log(body);
    
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
            authorId : Number(authorId),
            coverImage : body.coverImage,   
        }
    })
    return c.json({
        message : "Blog Created Successfully",
        id : blog.id
    })
  })

// Todo : add Pagination
blogRouter.get('/bulk', async (c) => {
    c.header('Access-Control-Allow-Origin', 'http://localhost:5173')

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

        if (!decoded) {
            throw new Error('Invalid token');
        }
        const blogs = await prisma.blog.findMany({
            select : {
                content: true,
                title: true,
                id: true,
                createdAt : true,
                coverImage: true,
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
                coverImage: true,
                author : {
                    select : {
                        name : true
                    }
                },
                comments : {
                    select : {
                        content: true,
                        author: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })
        // const comments = await prisma.comment.findMany({
        //     where: {
        //         blogId: Number(id)
        //     }
        // });
    
        return c.json({
            blog,
            // comments
        })
    }catch(e){
        c.status(411);
        return c.json({
            message : "Error while fetching the post"
        })
    }
})

blogRouter.post("/:id/comment/:authorId", async (c) =>{
    const id = c.req.param("id");
    const authorId = c.req.param("authorId");
    const body = await c.req.json();
    // console.log(body);

    try{
        await prisma.comment.create({
            data: {
                content : body.postComment,
                blogId: Number(id),
                authorId: Number(authorId),
            }
        })
        c.status(201)
        return c.json({ redirectUrl :  `${id}`});
    }catch(error){
        console.log(error);
        return c.json({message : "Error creating comment"});
    }
})


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


