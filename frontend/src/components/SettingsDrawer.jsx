/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { HiMiniXCircle } from "react-icons/hi2";


const SettingsDrawer = ({settingsOpen, closeSettings, baseSettings, setBaseSettings}) => {
    const [sBaseOpen, setSBaseOpen] = useState(true);
    const [sImage2ImageOpen, setImage2ImageOpen] = useState(false);
    
    const [toggleNegPrompt, setToggleNegPrompt] = useState(false);
    const [resoloutionRadio, setResolutionRadio] = useState(2);

    const toggleRandomize = () => {
        if (!baseSettings.randomize)
            setBaseSettings((prev) => ({...prev, seed: Math.floor(Math.random() * 10000000)}));
        setBaseSettings((prev) => ({...prev, randomize: !baseSettings.randomize}));
    }

    const openBase = () => {
        setSBaseOpen(!sBaseOpen);
        //setImage2ImageOpen(false);
    } 
    
    const openI2I = () => {
        //setSBaseOpen(false);
        setImage2ImageOpen(!sImage2ImageOpen);
    }

    const setImageResoloution = (preset) => {
        var widths = [512, 512, 512, 768, 912];
        var heights = [912, 768, 512, 512, 512];
        setBaseSettings((prev) => ({...prev, width: widths[preset]}));
        setBaseSettings((prev) => ({...prev, height: heights[preset]}));
        setResolutionRadio(preset);
    };

    useEffect(() => {
        if (baseSettings.seed == 0)
            setBaseSettings((prev) => ({...prev, seed: Math.floor(Math.random() * 10000000)}));

    }, [baseSettings.seed, setBaseSettings])

    const handleInputChange = (e) => {
        const {id, value, type } = e.target;
        console.log()
        setBaseSettings((prev) => ({
            ...prev,
            [id]: type === "number" || type === "range" ? parseInt(value, 10) || 0 : value
        }))
    }

    return (
        <div className={`flex flex-col h-screen bg-primary-indigo absolute top-0 py-5 border-r-2 border-text-muted overflow-auto max-h-screen ${
                settingsOpen ? 'left-0' : '-left-full'
            } w-5/6 md:w-1/5 transition-all duration-200 ease-in-out`}>
            <h1 className='w-full text-center text-text-primary text-2xl font-bold'>Settings</h1>
            <button className="md:hidden" onClick={closeSettings}>close drawer</button>
            <ul className="flex flex-col gap-4 p-2">

                <li className='w-full flex-row items-center p-2 text-left relative border-[1px] rounded-md border-text-black bg-accent-green'>
                    <h2 className='text-text-primary w-full ml-2 text-xl font-semibold relative hover:cursor-pointer' onClick={openBase}>
                        Base generation
                        <span className="absolute h-full right-5">
                            <HiMiniXCircle className={"h-full w-full transition-all duration-100 ease-in-out " + (sBaseOpen ? "" : "-rotate-45")}/>
                        </span>
                    </h2>
                    <div className={`flex flex-col w-full px-2 overflow-hidden gap-1 border-text-primary text-text-primary text-lg ${sBaseOpen ? 'max-h-[120rem] overflow-auto' : 'max-h-0'} transition-all duration-200`}>
                        <div className="flex flex-col mt-2">
                            <div className="flex flex-row gap-2 align-middle w-full">
                                <label htmlFor="negPrompt" className="">Use negative prompt?</label>
                                <input type="checkbox" className="size-6" checked={toggleNegPrompt} onChange={() => setToggleNegPrompt(!toggleNegPrompt)}></input>
                            </div>
                            <textarea name="negPrompt" id="negPrompt" className={`align-middle text-text-black p-1 rounded-md ${toggleNegPrompt ? '' : 'h-0 invisible p-0'} 
                                transition-all duration-200<`} placeholder="Type negative prompt here..." value={baseSettings.negPrompt} onChange={handleInputChange}></textarea>
                        </div>


                        <h2>Image size:</h2>
                        <div className="flex flex-row divide-x-[1px] divide-text-muted text-sm text-text-black drop-shadow-lg">
                            <input type="radio" name="resolution" id="resolution-0" value={0} onChange={() => setImageResoloution(0)} className="hidden"/>
                            <label htmlFor="resolution-0" className={`w-full aspect-square rounded-l-md p-1 md:hover:bg-text-muted hover:cursor-pointer 
                                ${resoloutionRadio === 0 ? "bg-neutral-light" : "bg-text-primary"} flex items-center justify-center`}>16:9</label>

                            <input type="radio" name="resolution" id="resolution-1" value={1} onChange={() => setImageResoloution(1)} className="hidden"/>
                            <label htmlFor="resolution-1" className={`w-full aspect-square p-1 md:hover:bg-text-muted hover:cursor-pointer 
                                ${resoloutionRadio === 1 ? "bg-neutral-light" : "bg-text-primary"} flex items-center justify-center`}>2:3</label>

                            <input type="radio" name="resolution" id="resolution-2" value={2} onChange={() => setImageResoloution(2)} className="hidden"/>
                            <label htmlFor="resolution-2" className={`w-full aspect-square p-1 md:hover:bg-text-muted hover:cursor-pointer 
                                ${resoloutionRadio === 2 ? "bg-neutral-light" : "bg-text-primary"} flex items-center justify-center`}>1:1</label>

                            <input type="radio" name="resolution" id="resolution-3" value={3} onChange={() => setImageResoloution(3)} className="hidden"/>
                            <label htmlFor="resolution-3" className={`w-full aspect-square p-1 md:hover:bg-text-muted hover:cursor-pointer 
                                ${resoloutionRadio === 3 ? "bg-neutral-light" : "bg-text-primary"} flex items-center justify-center`}>3:2</label>

                            <input type="radio" name="resolution" id="resolution-4" value={4} onChange={() => setImageResoloution(4)} className="hidden"/>
                            <label htmlFor="resolution-4" className={`w-full aspect-square rounded-r-md p-1 md:hover:bg-text-muted hover:cursor-pointer 
                                ${resoloutionRadio === 4 ? "bg-neutral-light" : "bg-text-primary"} flex items-center justify-center`}>9:16 </label>
                        </div>

                        <div className="flex flex-row gap-5">
                            <div className="flex-1 flex flex-col">
                                <label htmlFor="width">Width:</label>
                                <input type="number" id="width" className="text-text-black p-1 rounded-md w-full" value={baseSettings.width} onChange={handleInputChange}></input>
                            </div>
                            <div className="flex-1 flex flex-col">
                                <label htmlFor="height">Height:</label>
                                <input type="number" id="height" className="text-text-black p-1 rounded-md w-full" value={baseSettings.height} onChange={handleInputChange}></input>
                            </div> 
                        </div>

                        <div className="flex flex-row gap-5">
                            <div className="flex-1">
                                <label htmlFor="steps">Steps: {baseSettings.steps}</label>
                                <input type="range" id="steps" className="w-full accent-accent-blue" min="1" max="200" step="1" value={baseSettings.steps} onChange={handleInputChange}></input>
                            </div>
                            <div className="flex-1">
                                <label htmlFor="cfg">CFG: {baseSettings.cfg}</label>
                                <input type="range" id="cfg" className="w-full accent-accent-blue" min="1" max="30" step="0.5" value={baseSettings.cfg} onChange={handleInputChange}></input>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex flex-row gap-2">
                                <label htmlFor="seed">Randomize seed?</label>
                                <input type="checkbox" className="size-6" checked={baseSettings.randomize} onChange={toggleRandomize}></input>
                            </div>
                            <input type="number" id="seed" className="text-text-black p-1 rounded-md w-full" 
                                value={baseSettings.seed} disabled={baseSettings.randomize} onChange={handleInputChange}></input>
                        </div>
                    </div>
                </li>

                <li className='w-full flex-row items-center p-2 text-left relative border-[1px] rounded-md border-text-black bg-gradient-to-b to-primary-purple from-primary-indigo brightness-75 hover:brightness-125'>
                    <h2 className='text-text-primary w-full ml-2 text-xl font-semibold relative' onClick={openI2I}>
                        Image2Image
                        <span className="absolute h-full"><HiOutlineXMark className="h-full"/></span>
                    </h2>
                    <div className={`flex flex-col w-full px-2 overflow-hidden gap-1 border-text-primary text-text-primary text-lg ${sImage2ImageOpen ? 'max-h-[120rem] overflow-auto' : 'max-h-0'} transition-all duration-200`}>
                        <div className="flex flex-col mt-2">
                            <div className="flex flex-row gap-2 align-middle w-full">
                                <label htmlFor="negPrompt" className="">Use negative prompt?</label>
                                <input type="checkbox" className="size-6" checked={toggleNegPrompt} onChange={() => setToggleNegPrompt(!toggleNegPrompt)}></input>
                            </div>
                            <textarea name="negPrompt" id="negPrompt" className={`align-middle text-text-black p-1 rounded-md ${toggleNegPrompt ? '' : 'h-0 invisible p-0'} 
                                transition-all duration-200<`} placeholder="Type negative prompt here..." value={baseSettings.negPrompt} onChange={handleInputChange}></textarea>
                        </div>


                        <h2>Image size:</h2>
                        <div className="flex flex-row divide-x-[1px] divide-text-muted text-sm text-text-black drop-shadow-lg">
                            <input type="radio" name="resolution" id="resolution-0" value={0} onChange={() => setImageResoloution(0)} className="hidden"/>
                            <label htmlFor="resolution-0" className={`w-full aspect-square rounded-l-md p-1 md:hover:bg-text-muted hover:cursor-pointer 
                                ${resoloutionRadio === 0 ? "bg-neutral-light" : "bg-text-primary"} flex items-center justify-center`}>16:9</label>

                            <input type="radio" name="resolution" id="resolution-1" value={1} onChange={() => setImageResoloution(1)} className="hidden"/>
                            <label htmlFor="resolution-1" className={`w-full aspect-square p-1 md:hover:bg-text-muted hover:cursor-pointer 
                                ${resoloutionRadio === 1 ? "bg-neutral-light" : "bg-text-primary"} flex items-center justify-center`}>2:3</label>

                            <input type="radio" name="resolution" id="resolution-2" value={2} onChange={() => setImageResoloution(2)} className="hidden"/>
                            <label htmlFor="resolution-2" className={`w-full aspect-square p-1 md:hover:bg-text-muted hover:cursor-pointer 
                                ${resoloutionRadio === 2 ? "bg-neutral-light" : "bg-text-primary"} flex items-center justify-center`}>1:1</label>

                            <input type="radio" name="resolution" id="resolution-3" value={3} onChange={() => setImageResoloution(3)} className="hidden"/>
                            <label htmlFor="resolution-3" className={`w-full aspect-square p-1 md:hover:bg-text-muted hover:cursor-pointer 
                                ${resoloutionRadio === 3 ? "bg-neutral-light" : "bg-text-primary"} flex items-center justify-center`}>3:2</label>

                            <input type="radio" name="resolution" id="resolution-4" value={4} onChange={() => setImageResoloution(4)} className="hidden"/>
                            <label htmlFor="resolution-4" className={`w-full aspect-square rounded-r-md p-1 md:hover:bg-text-muted hover:cursor-pointer 
                                ${resoloutionRadio === 4 ? "bg-neutral-light" : "bg-text-primary"} flex items-center justify-center`}>9:16 </label>
                        </div>

                        <div className="flex flex-row gap-5">
                            <div className="flex-1 flex flex-col">
                                <label htmlFor="width">Width:</label>
                                <input type="number" id="width" className="text-text-black p-1 rounded-md w-full" value={baseSettings.width} onChange={handleInputChange}></input>
                            </div>
                            <div className="flex-1 flex flex-col">
                                <label htmlFor="height">Height:</label>
                                <input type="number" id="height" className="text-text-black p-1 rounded-md w-full" value={baseSettings.height} onChange={handleInputChange}></input>
                            </div> 
                        </div>

                        <div className="flex flex-row gap-5">
                            <div className="flex-1">
                                <label htmlFor="steps">Steps: {baseSettings.steps}</label>
                                <input type="range" id="steps" className="w-full accent-accent-blue" min="1" max="200" step="1" value={baseSettings.steps} onChange={handleInputChange}></input>
                            </div>
                            <div className="flex-1">
                                <label htmlFor="cfg">CFG: {baseSettings.cfg}</label>
                                <input type="range" id="cfg" className="w-full accent-accent-blue" min="1" max="30" step="0.5" value={baseSettings.cfg} onChange={handleInputChange}></input>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex flex-row gap-2">
                                <label htmlFor="seed">Randomize seed?</label>
                                <input type="checkbox" className="size-6" checked={baseSettings.randomize} onChange={toggleRandomize}></input>
                            </div>
                            <input type="number" id="seed" className="text-text-black p-1 rounded-md w-full" 
                                value={baseSettings.seed} disabled={baseSettings.randomize} onChange={handleInputChange}></input>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default SettingsDrawer;