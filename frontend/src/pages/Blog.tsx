import { FullBlog } from "../components/FullBlog";
import { LoaderSkeleton } from "../components/LoaderSkeleton";
import { useBlog } from "../hooks"
import { useParams } from "react-router-dom";



export const Blog  = () => {
    const { id }  = useParams();
    const { loading, blog } = useBlog({
        id : id || ""
    });

    
    if(loading || !blog){
        return <div className="grid grid-cols-12">
            <div className="col-span-8">
                 <LoaderSkeleton />
            </div>
        </div>
    }

    return <div>
        <FullBlog blog={blog} />
    </div>
}