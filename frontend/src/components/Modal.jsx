export const Modal = ({ children, isOpen, onClose, title }) => {
    return (
        <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%)] max-h-full overflow-x-hidden bg-black/40 bg-opacity-20">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow-md dark:bg-gray-700">
                    <div className="">
                        <h3 className="">
                            {title}
                        </h3>

                        <button type="button"
                            className=""
                            onClick={onClose}
                        >
                            X
                        </button>
                    </div>
                    <div className="">
                        children
                    </div>
                </div>
            </div>
        </div>
    )
}