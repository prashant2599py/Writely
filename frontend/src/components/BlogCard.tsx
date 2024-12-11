import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "react-router-dom"
// import  { motion } from "framer-motion"
import { Button } from "./ui/Button";



interface BlogCardProps{
    id : number,
    authorName : string,
    title : string,
    content : string,
    publishedDate : string,
    coverImage : string,
}


export const BlogCard = ({
    id,
    authorName,
    title,
    content,
    publishedDate,
    coverImage,
}: BlogCardProps) => {
    // const { user } = useAuth0();
    // console.log(JSON.stringify(user));
    
    return (
        <Link to={`/blog/${id}`}>
            <div className=" bg-gradient-to-br from-gray-900 to-black max-w-screen-md flex mb-8 h-60 py-2 mt-2 rounded-sm">
                <div>
                    <img src={coverImage} alt="blog-image" className="h-48 w-72 px-2 py-2" />
                </div>
                <div className="justify-center ml-8 ">
                    <div className="text-white font-bold text-2xl">{title}</div>
                    <div className="mt-2 mb-2 max-w-screen-sm">
                        <p className="text-slate-500">{content.slice(0,100) + "..."}</p>
                    </div>
                    <Button  className="text-white border-white border-2 bg-black hover:bg-white hover:text-black hover:font-semibold p-2 rounded-lg">
                        Ream more....
                    </Button>
                        
                        <div className="flex justify-end mr-4">
                            <p className="text-slate-500 text-xs">Published By: {authorName}</p>
                        </div>
                        <div className="flex justify-end mr-4">
                            <p className="text-slate-400 text-xs">Posted on: {publishedDate}</p>
                        </div>                        
                </div>
            </div>        
        </Link>
    )
}

interface userNameProps{
    userName?: string
}
export function Avatar({ userName } : userNameProps){
    const { user } = useAuth0();
    const displayName = userName?.toUpperCase() || user?.name || 'U'
    return (<div className="relative inline-flex items-center justify-center w-9 h-9 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
        <span className="font-semibold text-lg text-gray-600 dark:text-gray-300 ">
           {displayName[0]}
        </span>
    </div>
    )
}