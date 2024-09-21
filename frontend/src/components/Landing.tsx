import { Link } from 'react-router-dom';
import { Button } from './ui/Button';

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-20 flex items-center">
        <Link className="flex items-center justify-center" to="/">
          <div className="sr-only">Blogify</div>
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
          <div className="ml-2 text-3xl h-18 font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to bg-zinc-950">Blogify</div>
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
            <Button className='flex justify-center items-center border-2 hover:bg-slate-100 w-20 h-10 rounded-lg '>Sign In</Button>
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
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Blogify
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Discover stories, thinking, and expertise from writers on any topic.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                {/* <form className="flex space-x-2">
                  <input className="max-w-lg flex-1 h-10 rounded-lg border-2 border-slate-200 pl-4" placeholder="Enter your email" type="email" />
                  <Button className='flex justify-center items-center w-28 h-10 rounded-lg bg-black text-white font-semibold'>Subscribe</Button>
                </form> */}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Sign up to get notified about new stories.{" "}
                  <Link className="underline underline-offset-2" to="/terms">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">Featured Posts</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 Blogify. All rights reserved.</p>
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
