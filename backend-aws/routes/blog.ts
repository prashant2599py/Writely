import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@plodhi/medium-common";
import { getCookie } from "hono/cookie";
// import multer from "multer";
import { PutObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from 'stream'

export const blogRouter = new Hono<{
    Bindings : {
        DATABASE_URL : string;
        JWT_SECRET : string;
    },
    Variables : {
        userId : string;
    }
}>();

// const upload = multer({dest : "uploads/"}).single("coverImage");

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

blogRouter.post('/upload', async (c) => {
    const { fileName, fileType } = await c.req.json();
    const uniqueFileName = `${Date.now()}-${fileName}`;
    try{
        const command = new PutObjectCommand({
            Bucket : process.env.S3_BUCKET_NAME as string,
            Key : `uploads/${uniqueFileName}`,
            ContentType : fileType,
        })
        const url = await s3Client.send(command);
        return c.json({
            uploadurl : url,
            fileurl : `https://s3.ap-south-1.amazonaws.com/${process.env.S3_BUCKET_NAME}/uploads/${uniqueFileName}`
        })
    }catch(error) {
        c.status(500);
        return c.json({message : "Error Uploading the file", error})
    }
})

 blogRouter.get("/images/:key" , async (c) => {
    const key = "/uploads/1730797923727-Screenshot (319).png"
    
    try{
        const command = new GetObjectCommand({
            Bucket : process.env.S3_BUCKET_NAME,
            Key : key,
        })
        const item = await s3Client.send(command);
        
        c.res.headers.set("Content-Length", item.ContentLength?.toString() || ""); // Sets content length if available
        
        if (!item.Body) {
            throw new Error("No body in S3 response");
        }
        const contentType = item.ContentType || "application/octet-stream";
        const readableStream = new ReadableStream({
            start(controller){
                const reader = item.Body as Readable;
                reader.on("data", (chunk: Buffer) => controller.enqueue(chunk));
                reader.on("end", () => controller.close());
                reader.on("error", (err: Error) => controller.error(err));
            },
        })
    
        return new Response(readableStream, {
            headers: {
              "Content-type"  : contentType,
              "Content-Length": item.ContentLength?.toString() || "",
            },
          });

    }catch(error){
        console.error("Error streaming image file:", error);
        return c.json({"message ": "Error getting image"})
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

// FIle including route 
// blogRouter.post('/post' , async (c) => {
//     const token = getCookie(c, 'token');
//     const body  = await c.req.formData();
    
//     const title = body.get('title');
//     const content = body.get('content');
//     const file = body.get('file');
    
//     if(typeof title !== 'string' || typeof content !== 'string'){
//         c.status(400);
//         return c.json({message : "Missing required fields : title, content, file"});
//     }

//     // Check if file is of type File
//     if (!(file instanceof File)) {
//         c.status(400);
//         return c.json({ message: "Invalid data: file is not a valid file" });
//     }

//     const fileName = `${Date.now()}-${file.name}`;

    
//     try{
//         const user = await verify(token as string, process.env.JWT_SECRET as string);
//         if(!user){
//             throw new Error('Unauthorized access');
//         }

//         const arrayBuffer = await file.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);

//         const command = new PutObjectCommand({
//             Bucket : process.env.S3_BUCKET_NAME,
//             Key : `uploads/${fileName}`,
//             Body : buffer,
//             ContentType : file.type,
//         });
//         const url = await s3.send(command);
//         const fileurl = String(url);

//         const blog = await prisma.blog.create({
//             data: {
//                 title : title,
//                 content : content,
//                 coverImage : fileurl,
//                 authorId : Number(user.id)

//             }
//         });
//         return c.json({
//             message : "Blog created successfully",
//             id : blog.id,
//             coverImage : fileurl
//         });
//     }catch(err){
//         c.status(500);
//         return c.json({message : "Error creating blog"});
//     }
// })

