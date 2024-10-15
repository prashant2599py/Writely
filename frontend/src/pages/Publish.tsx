import { Appbar } from "../components/AppBar"
import  axios  from "axios"
import { BACKEND_URL } from "../config"

import { useNavigate } from "react-router-dom"
import { useMemo, useRef, useState } from "react"
import JoditEditor from 'jodit-react';


export const Publish = () => {
    const editor = useRef(null);
    const [content, setContent] = useState<string>('');
    const [title, setTitle] = useState("");
    const navigate = useNavigate();
    // const handleContentChange = (newContent : string) => {
    //     setContent(newContent);
    // }

    const convertToPlainText = (html: string) => {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;
        return tempElement.textContent || tempElement.innerText || '';
    }
    const plainTextContent = convertToPlainText(content)

    const editorConfig = useMemo( () => ({
        height : 400,
    }), [])

    async function handleRequest(){
        try{
            const response =  await axios.post(`${BACKEND_URL}/api/v1/blog/post`, {
                title,
                content : plainTextContent
            }, {
                headers: {
                    'Content-Type'  :"application/json"
                },
                withCredentials: true
            }        
        );
            // console.log(response);
            navigate(`/blog/${response.data.id}`)

        }catch(err){
            console.error(err)
        }
    }
        
        // const options = [ 'bold', 'italic', '|', 'ul', 'ol', '|', 'font', 'fontsize', '|', 'outdent', 'indent', 'align', '|', 'hr', '|', 'fullsize', 'brush', '|', 'table', 'link', '|', 'undo', 'redo',];
        // const config = useMemo( () => ({
        //     readonly: false,
        //     placeholder: '',
        //     defaultActionOnPaste: 'insert_as_html',
        //     defaultLineHeight: 1.5,
        //     enter: 'div',
        //     // options that we defined in above step.
        //     buttons: options,
        //     buttonsMD: options,
        //     buttonsSM: options,
        //     buttonsXS: options,
        //     statusbar: false,
        //     sizeLG: 900,
        //     sizeMD: 700,
        //     sizeSM: 400,
        //     toolbarAdaptive: false,
        //     }),
        //     [],
        // );

        return <div className="h-screen bg-black">

            <Appbar />

            <div className="flex justify-center mt-8">
                <div className=" w-2/3">
                    <input onChange={(e)=> {
                        setTitle(e.target.value)
                    }} 
                    id="title" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border
                    border-gray-300 focus:ring-blue-500 focus:border-blue-500  dark:placeholder-gray-400 
                    dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Title..."  />
                </div>
            </div>

            <div className="flex justify-center mt-8">
            
                <JoditEditor
                    ref = {editor}
                    value={content}
                    onChange = {content => (setContent(content))}
                    config={editorConfig}
                    />
            </div> 

            <div className="flex justify-center mt-8 bg-black">
                <div className="flex items-center justify-between px-3 py-2">
                    <button onClick={handleRequest}
                    type="submit" className="font-medium rounded-2xl text-lg w-20 h-11 text-center me-2 mb-2 text-white bg-slate-700">
                    Publish
                    </button>
                    
                </div>
                
            </div>           
    
    </div>
}


