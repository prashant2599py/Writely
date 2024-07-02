import { Link } from "react-router-dom"

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
    return <Link to={`/blog/${id}`}>
                <div className="border-b border-slate-400 pb-4 pt-8 cursor-pointer max-w-screen-md  ">
                        <div className="flex">
                            <div className="flex justify-center flex-col ">
                                <Avatar name = {authorName} /> 
                            </div>
                                <div className="mr-2  ml-2 ">{authorName}</div> . 
                                <div className="ml-1 font-thin text-slate-500 text-sm">{publishedDate}</div>
                        </div>
                            <div className="text-xl font-semibold  pt-2">
                                {title}
                            </div>
                            <div className="text-md font-thin">
                                {content.slice(0,100) + "..."}
                            </div>
                            <div className="text-slate-500 text-sm font-thin pt-2">
                                {`${Math.ceil(content.length / 100)} minute(s) read`}
                            </div>
                            

                </div>
        </Link>
}

export function Avatar({ name }: { name : string }){
    return (<div className="relative inline-flex items-center justify-center w-7 h-7 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
        <span className="font-medium text-gray-600 dark:text-gray-300">
            {name[0]}
        </span>
    </div>
    )
}