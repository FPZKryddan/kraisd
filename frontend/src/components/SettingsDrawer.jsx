import { useState, useEffect } from "react";

const SettingsDrawer = ({settingsOpen, closeSettings}) => {
    const [sBaseOpen, setSBaseOpen] = useState(true);
    const [sImage2ImageOpen, setImage2ImageOpen] = useState(false);

    const [prompt, setPrompt] = useState("");
    const [toggleNegPrompt, setToggleNegPrompt] = useState(false);
    const [negPrompt, setNegPrompt] = useState("");
    const [steps, setSteps] = useState(20);
    const [cfg, setCFG] = useState(7);
    const [height, setHeight] = useState(512);
    const [width, setWidth] = useState(512);
    const [seed, setSeed] = useState(null);
    const [randomize, setRandomize] = useState(true);

    const toggleRandomize = () => {
        if (!randomize)
            setSeed(Math.floor(Math.random() * 10000000))
        setRandomize(!randomize)
        
    }

    const openBase = () => {
        setSBaseOpen(!sBaseOpen);
        setImage2ImageOpen(false);
    } 
    
    const openI2I = () => {
        setSBaseOpen(false);
        setImage2ImageOpen(!sImage2ImageOpen);
    }

    useEffect(() => {
        if (seed == null)
            setSeed(Math.floor(Math.random() * 10000000))
    }, [seed])



    return (
        <div className={`flex flex-col h-screen bg-secondary-mustard absolute top-0 overflow-scroll max-h-screen ${
                settingsOpen ? 'left-0' : '-left-full'
            } w-5/6 md:w-1/6 transition-all duration-200 ease-in-out`} >
            <h1 className='w-full text-center text-text-primary text-2xl font-bold'>Settings</h1>
            <button onClick={closeSettings}>close drawer</button>
            <ul className="flex flex-col gap-4">
                <li className='w-full text-left bg-secondary-mustard relative'>
                    <h2 className='text-text-primary ml-2 text-xl font-semibold' onClick={openBase}>Base generation</h2>
                    <div className={`flex flex-col w-full px-2 overflow-hidden border-t-2 border-text-primary text-text-primary text-lg ${sBaseOpen ? 'max-h-96 overflow-scroll' : 'max-h-0'} transition-all duration-200`}>
                        <div className="flex flex-col mt-2">
                            <div className="flex flex-row gap-2 align-middle w-full">
                                <label htmlFor="negPrompt" className="">Use negative prompt?</label>
                                <input type="checkbox" className="size-6"></input>
                            </div>
                            <textarea name="negPrompt" id="negPrompt" className="text-text-black p-1 rounded-md" placeholder="Type negative prompt here..."></textarea>
                        </div>
                        <label htmlFor="seed">Seed:</label>
                        <input type="number" id="seed" className="text-text-black p-1 rounded-md w-full" value={seed} onChange={(e) => setSeed(e.target.value)}></input>

                        <div className="flex flex-row gap-5">
                            <div className="flex-1 flex flex-col">
                                <label htmlFor="height">Height:</label>
                                <input type="number" id="height" className="text-text-black p-1 rounded-md w-full" value={height} onChange={(e) => setHeight(e.target.value)}></input>
                            </div> 
                            <div className="flex-1 flex flex-col">
                                <label htmlFor="width">Width:</label>
                                <input type="number" id="width" className="text-text-black p-1 rounded-md w-full" value={width} onChange={(e) => setWidth(e.target.value)}></input>
                            </div>
                        </div>

                        <div className="flex flex-row gap-5">
                            <div className="flex-1">
                                <label htmlFor="steps">Steps: {steps}</label>
                                <input type="range" id="steps" className="w-full accent-accent-blue" min="1" max="200" step="1" value={steps} onChange={(e) => setSteps(e.target.value)}></input>
                            </div>
                            <div className="flex-1">
                                <label htmlFor="cfg">CFG: {cfg}</label>
                                <input type="range" id="cfg" className="w-full accent-accent-blue" min="1" max="30" step="0.5" value={cfg} onChange={(e) => setCFG(e.target.value)}></input>
                            </div>
                        </div>
                    </div>
                </li>

                <li className='w-full text-left bg-secondary-mustard relative'>
                    <h2 className='text-text-primary ml-2 text-xl font-semibold' onClick={openI2I}>Image2Image</h2>
                    <div className={`flex flex-col w-full px-2 overflow-hidden border-t-2 border-text-primary text-text-primary text-lg ${sImage2ImageOpen ? 'max-h-96 overflow-scroll' : 'max-h-0'} transition-all duration-200`}>
                        <div className="flex flex-col mt-2">
                            <div className="flex flex-row gap-2 align-middle w-full">
                                <label htmlFor="negPrompt" className="">Use negative prompt?</label>
                                <input type="checkbox" className="size-6"></input>
                            </div>                            
                            <textarea name="negPrompt" id="negPrompt" className="text-text-black p-1 rounded-md" placeholder="Type negative prompt here..."></textarea>
                        </div>
                        <label htmlFor="seed">Seed:</label>
                        <input type="number" id="seed" value={seed} onChange={(e) => setSeed(e.target.value)}></input>

                        <label htmlFor="height">Height:</label>
                        <input type="number" id="height" className="text-text-black p-1 rounded-md" value={height} onChange={(e) => setHeight(e.target.value)}></input>
                        <label htmlFor="width">Width:</label>
                        <input type="number" id="width" className="text-text-black p-1 rounded-md" value={width} onChange={(e) => setWidth(e.target.value)}></input>
                        
                        <div className="flex flex-row gap-5">
                            <div className="flex-1">
                                <label htmlFor="steps">Steps: {steps}</label>
                                <input type="range" id="steps" className="w-full" min="1" max="200" step="1" value={steps} onChange={(e) => setSteps(e.target.value)}></input>
                            </div>
                            <div className="flex-1">
                                <label htmlFor="cfg">CFG: {cfg}</label>
                                <input type="range" id="cfg" className="w-full" min="1" max="30" step="0.5" value={cfg} onChange={(e) => setCFG(e.target.value)}></input>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default SettingsDrawer;