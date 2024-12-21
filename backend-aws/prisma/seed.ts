const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function userSeedData(){

  try{
    await prisma.user.upsert({
    where: {    
      id: 14,   
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
        id: 15,
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
      title: "How I Study Consistently With A Full-Time Job",
      content: "In most video games we have a main mission or quest and level up along the way We also have side quests. As we play through them, we improve and unlock new skills. This makes it easier to progress through the game. The main quest is like our goal. Our sidequests are like the milestones we reach on the journey towards our main goal. When we complete side quests we’re rewarded with new skills and perks.They provide another hit of dopamine and keep us engaged. Last year, my goal was to become a cloud engineer. The only way to get the outcome I wanted was to learn new skills and apply them to the kind of project a cloud engineer would do. The subgoals were the stages of the project, such as learning programming, APIs, and databases to name a few. Whenever I learned something new and applied it, I unlocked a new skill. what are your own goals",
      author: {
        connect : {username : 'testuser2@gmail.com'}
      },
      tags: ["Programming", "Goals"],
      coverImage : `https://d1qi1e4y57otxy.cloudfront.net/uploads/consistency.jpeg`,
      createdAt: new Date(),
      updatedAt: new Date(),
  
    },
    {
    
      title: "Can you solve this famous interview question?",
      content: "There are 100 passengers lined up (in a random order) to board a plane. The plane is fully booked, meaning there are exactly 100 seats available. Due to a technical malfunction, the first passenger chooses a seat at random, with all seats equally likely. Each of the other passengers then proceeds as follows: if their assigned seat is free, they will sit in it; otherwise, they will take a random available seat. What is the probability that the last passenger will sit in their assigned seat? This problem, known as the “100-seat airplane problem,” is a popular interview question because it tests candidates’ understanding of probability, recursion, and problem-solving techniques. It frequently appears in tech and finance job interviews, particularly in companies that require strong quantitative skills (e.g., Google, Facebook, Amazon, and finance firms like hedge funds and investment banks. Can you find the right answer and explain how it’s derived? Before checking the solution, try solving this brain teaser on your own!",
      author: {
        connect : {username: "testuser1@gmail.com"}
      },
      tags: ["Interviews", "Interview Questions"],
      coverImage : `https://d1qi1e4y57otxy.cloudfront.net/uploads/plane problem.jpeg`,
      createdAt: new Date(),
      updatedAt: new Date(),
    
    },
    {
   
      title: "Best Practices for Writing Clean JavaScript Code",
      content: "JavaScript is one of the most popular programming languages in web development, known for its flexibility and wide application across browsers and servers. But with great power comes great responsibility — maintaining clean, efficient, and readable code is crucial, especially when multiple developers are collaborating on a project. In this article, we’ll dive into essential best practices that will help you write better JavaScript, improve performance, and ensure long-term maintainability. Use let and const Instead of varGone are the days of using var to declare variables. Modern JavaScript encourages the use of let and const to improve code clarity and prevent issues caused by function scoping. const should be used for variables that won’t be reassigned, while let should be used for variables that can change.",
      author: {
        connect : {username: "testuser2@gmail.com"}
      },
      tags: ["Backend", "JavaScript"],
      coverImage : `https://d1qi1e4y57otxy.cloudfront.net/uploads/js.png`,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
 
      title: "7 Simple Tips to Improve Daily Focus",
      content: "Managing your daily focus can often feel like a rollercoaster — filled with highs, lows, and unexpected turns.Some days, you’ll feel on top of the world, effortlessly sharp and clear. On others, focusing for even three minutes can feel like a challenge. Which led me to wonder:What can I do to take control of my daily focus? Through a mix of books, articles, podcasts, and drawing from my own experience, I have uncovered seven simple tips that can profoundly transform your ability to concentrate.While this blog particularly resonates with those familiar with the challenges of ADHD, these strategies are universally applicable for anyone seeking to improve their daily focus. Ready to dive in",
      author: {
        connect : {username: "testuser2@gmail.com"}
      },
      tags: ["Focus", "Exercise", "Health"],
      coverImage : `https://d1qi1e4y57otxy.cloudfront.net/uploads/focus.jpeg`,
      createdAt: new Date(),
      updatedAt: new Date(),
   
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
  