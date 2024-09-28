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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {blogs.map(blog => <BlogCard
                key={blog.id}
                    id={blog.id}
                    authorName={blog.author.name|| "User"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={blog.createdAt}
                    />
                )}
                {/* {JSON.stringify(blogs)} */}
                
            </div>
        </div>
    </div>
}