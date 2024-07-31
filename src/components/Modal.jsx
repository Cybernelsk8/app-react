import Card from "./Card"

const Modal = ({head,foot,children}) => {

    return (
        <div className ='inset-0 fixed h-screen bg-gray-900 bg-opacity-30 z-30 overflow-y-auto'>
            <div  className="relative flex justify-center mt-6">
                <Card className="max-w-5xl flex flex-col">
                    {children}                    
                </Card>
            </div>
        </div>
    )

}

export default Modal