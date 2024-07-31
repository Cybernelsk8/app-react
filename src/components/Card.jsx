const Card = ({children, className }) => {

    return (
        <div className={"mb-5 flex items-center justify-center " + className }>
            <div className="bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light flex flex-col">
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Card