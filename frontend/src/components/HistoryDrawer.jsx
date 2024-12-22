import { useState, useEffect } from "react";

// eslint-disable-next-line react/prop-types
const HistoryDrawer = ({historyOpen, closeHistory}) => {
    return (
        <div className={`flex flex-col h-screen bg-secondary-mustard absolute top-0 overflow-auto max-h-screen ${
            historyOpen ? 'right-0' : '-right-full'
            } w-5/6 md:w-1/6 transition-all duration-200 ease-in-out`}>
            <h1 className='w-full text-center text-text-primary text-2xl font-bold'>History</h1>
            <button onClick={closeHistory}>close drawer</button>
            <ul className="flex flex-col gap-4">
            
            </ul>
        </div>
    )
}

export default HistoryDrawer;