interface ButtonProps{
    className: string,
    children?:string
}
export const Button = ({ className,   children }: ButtonProps) => {
    return <button className="p-2 justify-center">
        <div className = {className}>
            {children}
        </div>
    </button>
}