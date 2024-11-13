import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { motion } from 'framer-motion';
// import { ArrowRight } from 'lucide-react';
// import { useBlogs } from '../hooks';
// import { BlogCard } from './BlogCard';

export default function Landing() {

  // const { blogs } = useBlogs();
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <header className="px-4 lg:px-6 h-20 flex items-center bg">
        <Link className="flex items-center justify-center" to="/">
          <div className="sr-only">Writely</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M8 7h6" />
            <path d="M8 11h8" />
            <path d="M8 15h6" />
          </svg>
          <div className="ml-2 text-3xl h-18 font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to bg-slate-200">Writely</div>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/">
            Home
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/">
            Categories
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/about">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/contact">
            Contact
          </Link>
        </nav>
        <div className="ml-4 flex items-center gap-2">
          {/* <Button variant="outline">Sign In</Button>
          <Button>Sign Up</Button> */}
          <Link to="/signin">
            <Button className='flex justify-center items-center border-2 hover:bg-slate-100 hover:text-black hover:font-semibold w-20 h-10 rounded-lg '>Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button className='flex justify-center items-center w-20 h-10 rounded-lg bg-black text-white font-semibold'>Sign Up</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
              <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
                >
                  Discover Inspiring Stories
              </motion.h1>               
              </div>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xl text-gray-300 mb-8"
              >
                Explore a world of captivating blogs curated just for you
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Button className="bg-white text-black hover:bg-gray-200 m-2 p-2 rounded-lg">
                  Start Reading 
                  {/* <ArrowRight className="ml-2 h-4 w-4" /> */}
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
        <section className="mb-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">Featured Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {/* {blogs.map(blog => <BlogCard 
                  key={blog.id}
                  id={blog.id}
                  authorName={blog.author.name || "User"}
                  title={blog.title}
                  content={blog.content}
                  publishedDate={blog.createdAt}
              />)} */}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Writely. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="/terms">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="/privacy">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
