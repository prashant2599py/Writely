import { SignupInput } from "@plodhi/medium-common";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react";
import { BACKEND_URL } from "../config";
// import { setCookie} from 'hono/cookie'

export const Auth = ({type}: {type : "signup" | "signin"})=> {
    const navigate = useNavigate();

    const { loginWithRedirect } = useAuth0();
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name : "",
        username: "",
        password: ""
    })

    async function sendRequest(){
        try{
            await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" :"signin"}`, postInputs, {
                withCredentials: true,
            });
            // const jwt = response.data;
            // localStorage.setItem("token",jwt);
            // setCookie('token', jwt);
            navigate("/blogs")
        }catch(e){ 
            console.error(e); 
            alert("Error while signing up");
        }
    }
    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
                <div className="px-10">                  
                    <div className="text-3xl font-extrabold">
                        Create an Account
                    </div>

                    <div className="text-slate-500">
                        {type === "signin" ? "Don't have an account?" :  "Already have an account?"}
                        <Link className="pl-2 underline" to={type === "signin" ? "/signup" :  "/signin"}>
                            {type === "signin" ? "Sign up" : "Sign in  "}
                        </Link>
                    </div>
                </div>
                <div className="pt-4">
                {type === "signup" ?<LabelledInput label="Name" placeholder="Name...." onChange={(e) => {
                    setPostInputs({
                        ...postInputs,
                        name: e.target.value
                      })
                }} /> : null}

                <LabelledInput label="username" placeholder="username@gmail.com" onChange={(e) => {
                    setPostInputs({
                        ...postInputs,
                        username: e.target.value
                    })
                }} />

                <LabelledInput label="password" type= {"password"}   placeholder="123456" onChange={(e) => {
                    setPostInputs({
                        ...postInputs,
                        password: e.target.value
                    })
                }} />
                <button onClick={sendRequest} type="button" className="w-full mt-8 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4
                    focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700
                    dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign up" : "Sign in"}</button>
                </div>
                
                <Link to={type === 'signin' ? "/auth0-singin" : "/signup"}>
                    <button onClick={ () => loginWithRedirect() } className="p-2 justify-center w-full bg-blue-400 rounded-lg mt-4 font-semibold">{type === "signin" ? "Sign in with Google" : "Sign Up with Google"}</button>
               </Link>
            </div>
        </div>
    </div>
}
interface LabelledInputType{
    label : string;
    placeholder : string;
    onChange :  (e : ChangeEvent<HTMLInputElement>) => void;
    type? : string
}

function LabelledInput({label, placeholder, onChange, type}:  LabelledInputType){
    return <div>
    <label  className="block mb-2 text-sm font-semibold text-black pt-2">{label}</label>
    <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300
     text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
     placeholder={placeholder}   required />
</div>
}