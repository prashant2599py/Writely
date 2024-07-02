import { Appbar } from "../components/AppBar"
import { BlogCard } from "../components/BlogCard"
import { LoaderSkeleton } from "../components/LoaderSkeleton";
import { useBlogs } from "../hooks"

export const  Blogs = () =>{

    const {loading, blogs}  = useBlogs();

    if(loading){
        return <div>
            <LoaderSkeleton />
            <LoaderSkeleton />
            <LoaderSkeleton />
            <LoaderSkeleton />
            <LoaderSkeleton />
        </div>
    }
    return <div>
        <Appbar />
        <div className="flex justify-center">
            <div className="max-w-xl">
                {blogs.map(blog => <BlogCard
                    id={blog.id}
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={"19th Feb 2024"}
                />
                )}
                
            </div>
        </div>
    </div>
}