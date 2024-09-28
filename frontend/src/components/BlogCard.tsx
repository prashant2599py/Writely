import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "react-router-dom"
import  { motion } from "framer-motion"
import { Button } from "./ui/Button";



interface BlogCardProps{
    id : number,
    authorName : string,
    title : string,
    content : string,
    publishedDate : string,

}


export const BlogCard = ({
    id,
    authorName,
    title,
    content,
    publishedDate,
}: BlogCardProps) => {
    // const { user } = useAuth0();
    // console.log(JSON.stringify(user));
    
    return <Link to={`/blog/${id}`}>
                <div className="pb-4 pt-8 cursor-pointer max-w-screen-md  ml-12">
                        <motion.div                           
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-lg w-3/4"
                        >

                            <img src={`/placeholder.svg?height=200&width=400`} alt="Blog post" className="w-full h-48 object-cover" />
                            
                            <div className="p-6">
                            <h4 className="text-lg font-semibold mb-2 text-white">{title}</h4>
                            <p className="text-gray-400 mb-4">{content.slice(0,100) + "..."}</p>
                            <Button  className="text-white border-white border-2 bg-black hover:bg-white hover:text-black hover:font-semibold p-2 rounded-lg">
                                Ream more....
                                {/* Read More <ChevronRight className="ml-2 h-4 w-4" /> */}
                            </Button>
                            </div>
                            <div className="text-white ml-4">Created on : {publishedDate}</div>
                            <p className="ml-4 text-white">Published By: {authorName}</p>
                            <div className="text-slate-500 text-sm font-thin pt-2 mb-4 ml-4">
                                {`${Math.ceil(content.length / 100)} minute(s) read`}
                            </div>
                    </motion.div>
                            

                </div>
        </Link>
}

export function Avatar(){
    const { user } = useAuth0();
    return (<div className="relative inline-flex items-center justify-center w-7 h-7 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
        <span className="font-medium text-gray-600 dark:text-gray-300">
           {user?.name ? user.name[0] : 'U'}
        </span>
    </div>
    )
}