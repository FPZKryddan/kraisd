import { useState, useEffect } from "react";

const SettingsDrawer = ({settingsOpen, closeSettings}) => {
    const [sBaseOpen, setSBaseOpen] = useState(true);
    const [sImage2ImageOpen, setImage2ImageOpen] = useState(false);

    const [negPrompt, setNegPrompt] = useState("");
    const [steps, setSteps] = useState(20);
    const [cfg, setCFG] = useState(7);
    const [height, setHeight] = useState(512);
    const [width, setWidth] = useState(512);
    const [seed, setSeed] = useState(null);
    
    const [toggleNegPrompt, setToggleNegPrompt] = useState(false);
    const [randomize, setRandomize] = useState(true);
    const [resoloutionRadio, setResolutionRadio] = useState(2);

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

    const setImageResoloution = (preset) => {
        var widths = [512, 512, 512, 768, 910];
        var heights = [910, 768, 512, 512, 512];
        setWidth(widths[preset]);
        setHeight(heights[preset]);
        setResolutionRadio(preset);
    };

    useEffect(() => {
        if (seed == null)
            setSeed(Math.floor(Math.random() * 10000000))
    }, [seed])

    console.log(resoloutionRadio)

    return (
        <div className={`flex flex-col h-screen bg-secondary-mustard absolute top-0 overflow-scroll max-h-screen ${
                settingsOpen ? 'left-0' : '-left-full'
            } w-5/6 md:w-1/6 transition-all duration-200 ease-in-out`}>
            <h1 className='w-full text-center text-text-primary text-2xl font-bold'>Settings</h1>
            <button onClick={closeSettings}>close drawer</button>
            <ul className="flex flex-col gap-4">
                <li className='w-full text-left relative'>
                    <h2 className='text-text-primary ml-2 text-xl font-semibold' onClick={openBase}>Base generation</h2>
                    <div className={`flex flex-col w-full px-2 overflow-hidden border-t-2 gap-1 border-text-primary text-text-primary text-lg ${sBaseOpen ? 'max-h-[120rem] overflow-scroll' : 'max-h-0'} transition-all duration-200`}>
                        
                        <div className="flex flex-col mt-2">
                            <div className="flex flex-row gap-2 align-middle w-full">
                                <label htmlFor="negPrompt" className="">Use negative prompt?</label>
                                <input type="checkbox" className="size-6" checked={toggleNegPrompt} onChange={() => setToggleNegPrompt(!toggleNegPrompt)}></input>
                            </div>
                            <textarea name="negPrompt" id="negPrompt" className={`align-middle text-text-black p-1 rounded-md ${toggleNegPrompt ? '' : 'h-0 invisible p-0'} transition-all duration-200<`} placeholder="Type negative prompt here..." value={negPrompt} onChange={(e) => setNegPrompt(e.target.value)}></textarea>
                        </div>


                        <h2>Image size:</h2>
                        <div className="flex flex-row divide-x-[1px] divide-text-muted text-sm text-text-black drop-shadow-lg">
                            <input type="radio" name="resolution" id="resolution-0" value={0} onChange={() => setImageResoloution(0)} className="hidden"/>
                            <label htmlFor="resolution-0" className={`w-full aspect-square rounded-l-md p-1 md:hover:bg-text-muted hover:cursor-pointer ${resoloutionRadio === 0 ? "bg-neutral-light" : "bg-text-primary"} flex items-center justify-center`}>16:9</label>

                            <input type="radio" name="resolution" id="resolution-1" value={1} onChange={() => setImageResoloution(1)} className="hidden"/>
                            <label htmlFor="resolution-1" className={`w-full aspect-square p-1 md:hover:bg-text-muted hover:cursor-pointer ${resoloutionRadio === 1 ? "bg-neutral-light" : "bg-text-primary"} flex items-center justify-center`}>2:3</label>

                            <input type="radio" name="resolution" id="resolution-2" value={2} onChange={() => setImageResoloution(2)} className="hidden"/>
                            <label htmlFor="resolution-2" className={`w-full aspect-square p-1 md:hover:bg-text-muted hover:cursor-pointer ${resoloutionRadio === 2 ? "bg-neutral-light" : "bg-text-primary"} flex items-center justify-center`}>1:1</label>

                            <input type="radio" name="resolution" id="resolution-3" value={3} onChange={() => setImageResoloution(3)} className="hidden"/>
                            <label htmlFor="resolution-3" className={`w-full aspect-square p-1 md:hover:bg-text-muted hover:cursor-pointer ${resoloutionRadio === 3 ? "bg-neutral-light" : "bg-text-primary"} flex items-center justify-center`}>3:2</label>

                            <input type="radio" name="resolution" id="resolution-4" value={4} onChange={() => setImageResoloution(4)} className="hidden"/>
                            <label htmlFor="resolution-4" className={`w-full aspect-square rounded-r-md p-1 md:hover:bg-text-muted hover:cursor-pointer ${resoloutionRadio === 4 ? "bg-neutral-light" : "bg-text-primary"} flex items-center justify-center`}>9:16 </label>
                        </div>

                        <div className="flex flex-row gap-5">
                            <div className="flex-1 flex flex-col">
                                <label htmlFor="width">Width:</label>
                                <input type="number" id="width" className="text-text-black p-1 rounded-md w-full" value={width} onChange={(e) => setWidth(e.target.value)}></input>
                            </div>
                            <div className="flex-1 flex flex-col">
                                <label htmlFor="height">Height:</label>
                                <input type="number" id="height" className="text-text-black p-1 rounded-md w-full" value={height} onChange={(e) => setHeight(e.target.value)}></input>
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

                        <div className="flex flex-col">
                            <div className="flex flex-row gap-2">
                                <label htmlFor="seed">Randomize seed?</label>
                                <input type="checkbox" className="size-6" checked={randomize} onChange={toggleRandomize}></input>
                            </div>
                            <input type="number" id="seed" className="text-text-black p-1 rounded-md w-full" value={seed} disabled={randomize} onChange={(e) => setSeed(e.target.value)}></input>
                        </div>
                    </div>
                </li>

                <li className='w-full text-left relative'>
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