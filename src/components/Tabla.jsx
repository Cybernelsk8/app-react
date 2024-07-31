
const Tabla = ({thead,tbody}) => {

    return (
        <>
            <div className="w-full flex flex-col">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-5 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden border-2 border-gray-200 shadow-lg  md:rounded-md">
                            <table className="min-w-full divide-y divide-gray-200 px-5">
                                <thead className='bg-blue-500 text-blue-200'>
                                    {thead}
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tbody}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Tabla;