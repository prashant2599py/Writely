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
        <div className="flex justify-center bg-black">
            <div>
                {blogs.map(blog => <BlogCard
                key={blog.id}
                    id={blog.id}
                    coverImage={blog.coverImage}
                    authorName={blog.author.name|| "User"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={blog.createdAt}
                    // comments={blog.comments}
                    />
                )}
                {/* {JSON.stringify(blogs)} */}
                
            </div>
        </div>
    </div>
}