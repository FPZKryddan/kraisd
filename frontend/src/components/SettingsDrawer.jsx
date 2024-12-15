import { useState } from "react";

const SettingsDrawer = ({settingsOpen, closeSettings}) => {
    const [sBaseOpen, setSBaseOpen] = useState(true);


    return (
        <div className={`flex flex-col p-5 h-full bg-secondary-mustard absolute top-0 overflow-scroll max-h-screen ${
                settingsOpen ? 'left-0' : '-left-full'
            } w-5/6 transition-all duration-200 ease-in-out`} >
            <h1 className='w-full text-center text-text-primary text-2xl font-bold'>Settings</h1>
            <button onClick={closeSettings}>close drawer</button>
            <ul>
                <li className='w-full text-left bg-secondary-mustard relative' onClick={() => setSBaseOpen(!sBaseOpen)}>
                    <h2 className='border-b-2 border-text-primary text-text-primary'>Base generation</h2>
                    <div className={`flex flex-col w-full bg-secondary-coral overflow-hidden ${sBaseOpen ? 'max-h-80 overflow-scroll' : 'max-h-0'} bg-primary-indigo transition-all duration-200`}>
                        <p>hej</p>
                        <p>hej</p>
                        <p>hej</p>
                        <p>hej</p>
                        <p>hej</p>
                        <p>hej</p>
                        <p>hej</p>
                        <p>hej</p>
                        <p>hej</p>
                        <p>hej</p>
                        <p>hej</p>
                        <p>hej</p>
                        <p>hej</p>
                        <p>hej</p>
                        <p>hej</p>
                        <p>hej</p>
                        <p>hej</p>
                        <p>hej</p>
                        <p>hej</p>
                        <p>hej</p>
                        <p>hej</p>
                        <p>hej</p>
                    </div>
                </li>
                <p>d</p>
                <p>d</p>
                <p>d</p>
                <p>d</p>
                <p>d</p>
                <p>d</p>
                <p>d</p>
                <p>d</p>
                <p>d</p>
                <p>d</p>
                <p>d</p>
                <p>d</p>
                <p>d</p>
                <p>d</p>
                <p>d</p>
                <p>d</p>
                <p>d</p>
                <p>d</p>
            </ul>
        </div>
    )
}

export default SettingsDrawer;