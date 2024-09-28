const { PrismaClient } = require('@prisma/client');
// import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function userSeedData(){

  try{
    await prisma.user.upsert({
    where: {    
      id: 1,   
      },
      create : {  
        name : 'testuser1',
        username : "testuser1@gmail.com",
        password : "testuser1",
  
      },
      update : {},
    });
  
    await prisma.user.upsert({
      where : {
        id: 2,
      },
      create : {
        name : 'testuser2',
        username:  "testuser2@gmail.com",
        password : "testuser2",
      }, 
      update : {},
    });
  }catch(error){
    console.log(error);
    throw error;
  }
}

const blogSeedData = [
    {
      title: "Understanding JavaScript Closures",
      content: "Closures are an important concept in JavaScript...",
      author: {
        connect : {username : 'testuser2@gmail.com'}
      },
      tags: ["JavaScript", "Programming", "Web Development"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
    
      title: "React vs Vue: A Comparison",
      content: "When comparing React and Vue, both frameworks...",
      author: {
        connect : {username: "testuser1@gmail.com"}
      },
      tags: ["React", "Vue", "Frontend"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
   
      title: "Getting Started with Node.js",
      content: "Node.js is a popular runtime environment...",
      author: {
        connect : {username: "testuser2@gmail.com"}
      },
      tags: ["Node.js", "Backend", "JavaScript"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
 
      title: "Building REST APIs with Express",
      content: "Express is a lightweight framework for building...",
      author: {
        connect : {username: "testuser2@gmail.com"}
      },
      tags: ["Express", "Node.js", "API"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
 
      title: "Mastering CSS Grid",
      content: "CSS Grid is a powerful tool for creating responsive...",
      author: {
        connect : {username : "testuser2@gmail.com"}
      },
      tags: ["CSS", "Frontend", "Web Design"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {

      title: "The Future of Web Development in 2024",
      content: "Web development trends in 2024 are moving towards...",
      author: {
        connect : {username: "testuser2@gmail.com"}
      },
      tags: ["Web Development", "Future", "Tech"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {

      title: "Understanding Asynchronous Programming in JavaScript",
      content: "Asynchronous programming allows for non-blocking...",
      author: {
        connect : {username: "testuser2@gmail.com"}
      },
      tags: ["JavaScript", "Async", "Programming"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
   
      title: "Getting Started with TypeScript",
      content: "TypeScript is a typed superset of JavaScript...",
      author: {
        connect : {username : "testuser1@gmail.com"}
      },
      tags: ["TypeScript", "JavaScript", "Frontend"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
    
      title: "The Basics of GraphQL",
      content: "GraphQL is a query language for your API...",
      author: {
        connect: {username: "testuser1@gmail.com"}
      },
      tags: ["GraphQL", "API", "Backend"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
    
      title: "10 Tips for Writing Clean Code",
      content: "Clean code is not only about proper indentation...",
      author: {
        connect  :{username : "testuser1@gmail.com"}
      },
      tags: ["Coding Practices", "Programming", "Clean Code"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
     
      title: "An Introduction to MongoDB",
      content: "MongoDB is a NoSQL database that stores data in flexible...",
      author: {
        connect : {username: "testuser1@gmail.com"}
      },
      tags: ["MongoDB", "Database", "NoSQL"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ];


  async function seedDatabase(){

    try {
      await userSeedData();
      
      for(const blog of blogSeedData){
            await prisma.blog.create({
                data : blog,
            })
        }

    } catch(error){
      console.log(error);
      throw error;
    }finally{
      await prisma.$disconnect();
    }
  }
  seedDatabase().catch((error) => {
    console.log("Error while seeding data : ", error);
    process.exit(1);
  })
  