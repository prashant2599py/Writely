// import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react";
import axios from "axios";
import { Blog } from "../hooks"
import { Appbar } from "./AppBar"
import { Avatar } from "./BlogCard"
import { BACKEND_URL } from "../config";
import { User } from "@auth0/auth0-react";



export const BlogWithId  = ({ blog }: {blog : Blog}) => {

    const [postComment, setPostComment] = useState("");
    const [user, setUser] = useState<User | null>(null);  // State for authenticated user

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/v1/user/me`, {
                    method: "GET",
                    credentials: "include",  // Include cookies in request
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);  // Set user data on successful response
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        fetchUser();
    }, []);

    const  handleRequest = async (e : React.FormEvent) => {
        e.preventDefault()
        const id = blog.id;
        const authorId = user?.id;
        await axios.post(`${BACKEND_URL}/api/v1/blog/${id}/comment/${authorId}`, {
            postComment,
        });
        // console.log(response);
    }

    if (!blog) {    
        return <div>Loading...</div>;
    }
    // const {user} = useAuth0();
    // console.log(user);
    return <div>
        <Appbar />
            <div className="flex justify-center">
                <div className="grid grid-cols-12 w-full px-20 pt-200 max-w-screen-xl pt-12">
                    <div className="col-span-8">
                        <div>
                            {<img src={blog.coverImage} alt="Blog cover" height={600} width={600} />}
                        </div>

                        <div className="pt-4 text-slate-500">
                            created on:
                            {blog.createdAt}
                        </div>
                        <div className="text-6xl font-extrabold mt-8">
                            {blog.title}
                        </div>
                        <div className="pt-4 pr-2 mb-8">
                            {blog.content}
                        </div>
                        
                        {/* <Link to={"/update"}>
                            <Button className="bg-blue-600 p-3 rounded-lg hover:bg-blue-400 border-2 hover:border-black">Update</Button>
                        </Link> */}
                        <div className="text-3xl font-bold">
                            Comments({blog.comments?.length})
                        </div>
                        <div className="h-44 justify-center">
                            {/* <img src="" alt="" /> */}
                            {/* <label className="flex" >What are your thoughts?</label> */}
                            <form onSubmit={handleRequest}>
                                <input type="text" id="comments" onChange={(e) => setPostComment(e.target.value)} placeholder="What are your thoughts?" className="mt-4 h-12 w-full text-gray-800 font-semibold text-sm bg-white border-slate-500 border-2 cursor-pointer  rounded" />
                                <button type="submit" className="mt-4 bg-slate-500 px-4 py-2 rounded-md">Post Comment</button>
                            </form>
                        </div>
                        {blog.comments?.length  && (
                            <div key={blog.id} className="">
                                {blog.comments?.map((comment) => (
                                    <div className="flex">
                                        <div>
                                            <Avatar userName={comment.author.name[0]}/>
                                        </div>
                                        <div key={comment.id} className="border-t ml-4">
                                            <div className="font-semibold text-2xl">{comment.author.name}</div>
                                            <div className="pt-2 text-lg mx-2 mb-4">{comment.content}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="col-span-4 ">
                            <div className="text-lg text-slate-600 ml-12">
                                Author
                            </div>
                            <div className="flex w-full">
                                <div className="pr-4 flex flex-col justify-center">
                                    <Avatar userName={blog.author.name[0]} />
                                </div>
                                
                                <div className="pt-1">
                                    <div className="text-xl font-bold">
                                        {blog.author.name || "User"}
                                    </div>
                                    <div className="pt-2 text-slate-500">
                                        Random catch phrase about the author's ability to grab the user's attention
                                    </div>
                                </div>
                            </div>
                            
                    </div>    
                </div>
                
            </div>
    </div>
}