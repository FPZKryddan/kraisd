/* eslint-disable react/prop-types */
import { HiOutlineXMark } from "react-icons/hi2";
import { HiMiniTrash } from "react-icons/hi2";

const HistoryDrawer = ({historyOpen, closeHistory, images, queue, setPreview, deleteTask}) => {



    return (
        <div className={`flex flex-col h-screen bg-primary-indigo fixed right-0 top-0 py-5 border-l-2 border-text-muted max-h-screen ${
            historyOpen ? 'translate-x-0' : 'translate-x-full'
            } w-5/6 md:w-1/5 transition-all duration-150 ease-in-out`}>
            <h1 className='w-full text-center text-text-primary text-2xl font-bold'></h1>
            <button className=" h-12 w-12 md:hidden" onClick={closeHistory}><HiOutlineXMark className="size-[40px] w-full"/></button>
            <ul className="flex flex-col h-full gap-10">
                <li className='w-full h-1/3 text-left relative'>
                    <h2 className='text-text-primary ml-2 text-xl font-semibold border-b-2 border-text-primary'>Queue</h2>
                    <ul className="flex flex-col w-full h-full overflow-auto p-2">
                        {queue.map((prompt, idx) => 
                            <li key={idx} className="flex flex-row w-full p-4 border-b-2 border-text-primary text-text-primary">
                                <p className="w-4/6 overflow-hidden whitespace-nowrap text-ellipsis">{prompt.item.prompt}</p>
                                <p className="w-1/6 text-center">{idx}</p>
                                <button className="w-1/5 bg-secondary-coral hover:bg-secondary-mustard rounded-md" onClick={() => deleteTask(prompt.item)}>
                                    <HiMiniTrash className="w-full"/>
                                </button>
                            </li>
                        )}
                    </ul>
                </li>
                <li className='w-full h-2/3 text-left relative'>
                    <h2 className='text-text-primary ml-2 text-xl font-semibold border-b-2 border-text-primary'>Gallery</h2>
                    <ul className="grid grid-cols-2 md:grid-cols-3 content-start w-full h-full overflow-auto p-5 gap-1">
                        {images.map((img, idx) => 
                            <li key={idx} className="group" onClick={() => setPreview(img)}>
                                <img className="group-hover:border-2 group-hover:cursor-pointer" src={img}></img>
                            </li>
                        )}
                    </ul>
                </li>
            </ul>
        </div>
    )
}

export default HistoryDrawer;