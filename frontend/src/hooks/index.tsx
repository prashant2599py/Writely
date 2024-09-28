import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";
import { format } from "date-fns";

function formatCreatedAt(dateString: string): string {
    const date = new Date(dateString);
    return format(date, "do MMM");
    // if (isNaN(date.getTime())) {
    //   console.error("Invalid date string:", dateString);
    //   return "Invalid Date";
    // }
    // // Assuming you want "28th Sept"
    // const day = date.getDate();
    // const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    // const suffix = (day % 10 === 1 && day !== 11) ? 'st' :
    //                (day % 10 === 2 && day !== 12) ? 'nd' :
    //                (day % 10 === 3 && day !== 13) ? 'rd' : 'th';
    // return `${day}${suffix} ${month}`;
  }
export interface Blog{
        "content": string,
        "title": string,
        "id": number,
        "author": {
            "name": string
        },
        "createdAt" : string,
}

export const useBlog = ({ id }: {id : string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();


    useEffect(()=>{
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers : {
                Authorization : localStorage.getItem("token")
            }
        })
            .then(response => {
                const fetchedBlog = response.data.blog;

                const formattedblog = {
                    ...fetchedBlog,
                    createdAt : formatCreatedAt(fetchedBlog.createdAt)
                }
                // setBlog(response.data.blog);
                setBlog(formattedblog);
                setLoading(false);
            })
    }, [id])
    return {
        loading,
        blog
    }
}

export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);


    useEffect(()=>{
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
            headers : {
                Authorization : localStorage.getItem("token")
            }
        })
            .then(response => {
                // console.log(response.data.blogs)
                const formattedBlogs = response.data.blogs.map((blog : Blog) => ({
                    ...blog,
                    createdAt: formatCreatedAt(blog.createdAt) // or any desired format
                }));
                // console.log(formatCreatedAt);
                setBlogs(formattedBlogs);
                // setBlogs(response.data.blogs);
                setLoading(false);
            })
    }, [])
    return {
        loading,
        blogs
    }
}