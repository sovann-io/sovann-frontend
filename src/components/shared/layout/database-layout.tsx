export interface DatabaseLayoutProps {
    title: string;
    children: React.ReactNode;
}

const DatabaseLayout = (props: DatabaseLayoutProps) => {
    return (
        <div className="flex flex-1 flex-col gap-4">
            <h1 className="container mx-auto text-2xl my-6">
                {props.title}
            </h1>
            <div className="container mx-auto px-4">
                {props.children}
            </div>
        </div>
    )
}

export default DatabaseLayout;