import { useAuth0 } from "@auth0/auth0-react"
import { Avatar } from "./BlogCard"
import { Link } from "react-router-dom"
import { Button } from "./ui/Button";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";


export const Appbar = () => {
    
    interface User{
        id: number,
        name : string
    }
    
    const { isAuthenticated, logout } = useAuth0(); 
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isUserAuthenticated, setIsUserAuthenticated ] = useState(false);
    
    const toggleDropDown = () => {
        setIsDropDownOpen( (prev) => !prev)
    }

    useEffect( () => {
        const fetchUser = async () => {
            try{
                const response = await  fetch(`${BACKEND_URL}/api/v1/user/me`, {
                    method:"GET",
                    credentials: "include"
                });
                if (response.ok) {
                    const data = await response.json();   
                    setUser(data.user);  // Access the `user` object returned by the backend
                    setIsUserAuthenticated(true);
                    console.log("Logged in");
                }else{
                    setIsUserAuthenticated(false);
                }
            }catch(error){
                console.error("Failed to fetch" + error)
                setIsUserAuthenticated(false);
            }
        };
        fetchUser(); 
    },[])
    
    return <div className=" flex justify-between px-20 py-4 bg-gradient-to-l from-slate-900 to-indigo-600">
        <Link to={'/blogs'} className="flex flex-col justify-center font-semibold font-serif text-4xl bg-clip-text text-transparent bg-gradient-to-r from-slate-600 to-black ">
            StoryForge
        </Link>
        <div className="flex">
            <Link to={`/publish`}>
                <button type="button" className=" mr-8 text-white bg-black hover:bg-black focus:outline-none focus:ring-4
                 font-medium rounded-2xl text-lg w-20 h-11 text-center me-2 mb-2
                ">New</button>
             </Link>
             {(isUserAuthenticated && user) || isAuthenticated  ?  (
                <div className="relative">
                    <button onClick={toggleDropDown}>
                            <Avatar userName={user?.name}/>
                    </button>

                    { isDropDownOpen && (
                        <ul className="absolute right-0 bg-white border rounded shadow-lg mt-2">
                            <li>
                                <button onClick={ () => {logout(); setIsDropDownOpen(false); }} className="text-white bg-slate-800 px-2 py-2 rounded-lg">Logout</button>
                            </li>

                        </ul>
                    ) }               
                
             </div>)  : (
                <Link to={`/signin`}>          
                    <Button className="p-2 justify-center">Login</Button>
                </Link>
             )
             }             
        </div>
    </div>
}