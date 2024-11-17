export default function Layout({children}){
    return (
        <div className={"max-w-screen-xl mx-auto px-10 max-lg:px-4 relative h-full"}>
            {children}
        </div>
    )
}