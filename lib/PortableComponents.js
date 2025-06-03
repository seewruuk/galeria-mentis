export const PortableComponents = {
    block: {
        normal: ({children}) => (
            <p className="">{children}</p>
        ),
        h1: ({children}) => (
            <h1 className="leading-[170%] text-[32px]">{children}</h1>
        ),
    }
}