import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { HiOutlineCog8Tooth, HiArrowPath } from "react-icons/hi2";
import SettingsDrawer from './components/SettingsDrawer';
import HistoryDrawer from './components/HistoryDrawer';
import { useSocket } from './hooks/useSocket';


function App() {
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const [baseSettings, setBaseSettings] = useState({
        prompt: "",
        negPrompt: "",
        steps: 20,
        cfg: 7,
        height: 512,
        width: 512,
        seed: 0,
        randomize: true
    })

    const [images, setImages] = useState([])

    const [prompt, setPrompt] = useState("");
    const [queue, setQueue] = useState([]);

    const [generatedSteps, setGeneratedSteps] = useState(0);
    const [totalGenerationSteps, setTotalGenerationSteps] = useState(0);
    const [generating, setGenerating] = useState(0);

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);

    const socket = useSocket("http://localhost:5000/", {
        transports: ["websocket"],
        cors: {
            origin: "*",
        },
    });

    useEffect(() => {
        if (!socket) return;

        socket.on("join", (event) => {
            socket.send("Connection established")
            console.log("connected to server ", event.data)
        });
        
        socket.on("leave", () => {
            console.log("Connection dropped")
        });
        
        socket.on("get_queue", (event) => {
            setQueue(event.queue)
        });
        
        socket.on("generation_started", (event) => {
            setTotalGenerationSteps(event.total_steps)
            setGenerating(true)
        });
        
        socket.on("generation_update", (event) => {
            setGeneratedSteps(event.step)
        });

        socket.on("generation_completed", (event) => {
            const convertedImage = decodeBase64Image(event.image)
            setImage(convertedImage)
            setGenerating(false)
            setImages((prev) => [convertedImage, ...prev])
            console.log("recieved image!")
        });

        return () => {
            socket.off("join")
            socket.off("leave")
            socket.off("get_queue")
            socket.off("generation_started")
            socket.off("generation_update")
            socket.off("generation_completed")
        }
    }, [socket])
    

    useEffect(() => {
        if (window.innerWidth > 768) { 
            setHistoryOpen(true)
            setSettingsOpen(true)
        }

    }, [])

    const submitPrompt = useCallback(() => {
        socket.emit("queue", {
            prompt: prompt, 
            negPrompt: baseSettings.negPrompt, 
            steps: baseSettings.steps, 
            cfg: baseSettings.cfg, 
            seed: baseSettings.seed, 
            width: baseSettings.width, 
            height: baseSettings.height
        })
        setBaseSettings((prev) => ({...prev, seed: Math.floor(Math.random() * 10000000)}));
    }, [prompt, baseSettings, socket])

    const decodeBase64Image = (base64Data, mimeType = "image/jpeg") => {
        return `data:${mimeType};base64,${base64Data}`;
    };
    
    const deleteTask = (task) => {
        console.log(task)
        socket.emit("delete_task", {task: task})
    }

    const handleKeyPress = useCallback((e) => {
        if (e.key == "Enter") {
            submitPrompt()
        }
        if (e.key == "Escape") {
            if (previewImage)
                setPreviewImage(null)
        }
    }, [submitPrompt, previewImage])

    useEffect(() => {
        window.addEventListener("keyup", handleKeyPress);
        
        return () => {
            window.removeEventListener("keyup", handleKeyPress);
        }
    }, [handleKeyPress])
    
    const handleClick = () => {
        if (window.innerWidth < 768) {
            if (settingsOpen) toggleSettings();
            if (historyOpen)  toggleHistory();
        }
    }
    
    const closePreview = () => {setPreviewImage(null)}
    const toggleSettings = () => {setSettingsOpen(!settingsOpen)}
    const toggleHistory = () => {setHistoryOpen(!historyOpen)}
    
    return (
        <div className="container max-w-full m-0 p-5 h-screen bg-primary-indigo
        flex flex-col justify-center overflow-x-hidden">
            <div className="flex flex-col h-full gap-5" onClick={handleClick}>
                <img className='w-[170px] h-[50px] mt-5 self-center' src='/logo.svg'></img>
                <input className="p-3 rounded-md w-full md:w-1/2 self-center text-text-black placeholder:text-text-muted placeholder:text-center 
                    resize-none" id='prompt' type='text' placeholder='Type prompt here...' value={prompt} onChange={(e) => setPrompt(e.target.value)}></input>

                <div className='flex flex-row gap-4 justify-center'>
                    <button className='size-[50px] bg-neutral-light rounded-full drop-shadow-3xl hover:contrast-150 text-text-primary cursor-pointer md:hidden'>
                        <HiOutlineCog8Tooth className='size-[40px] w-full' onClick={toggleSettings}/>
                    </button>
                    <button className='w-[175px] h-[50px] bg-accent-green rounded-xl drop-shadow-3xl hover:contrast-150 text-text-primary text-2xl font-bold' onClick={submitPrompt}>Generate</button>
                    <button className='size-[50px] bg-neutral-light rounded-full drop-shadow-3xl hover:contrast-150 text-text-primary relative md:hidden'>
                        <HiArrowPath className='size-[40px] w-full' onClick={toggleHistory}/>
                        <p className='size-5 leading-5 text-lg absolute top-0 right-0 bg-secondary-coral text-center rounded-full animate-bounce'>1</p>
                    </button>
                </div>


                {image 
                    ? <img className="self-center shadow-xl drop-shadow-2xl" src={image} style={{ width: "auto", height: "auto" }}/>
                    : <h1 className="self-center text-text-primary text-3xl">No images generated yet! Generate one now!</h1>
                }
                <div className={'h-12 w-1/2 mx-auto relative mt-auto rounded-2xl text-text-primary text-lg transition-all duration-200 ease-in-out ' + (generating == true ? "translate-y-0" : "translate-y-96")}>
                    <h1 className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>Generation steps: {generatedSteps} / {totalGenerationSteps}</h1>
                    <progress className="w-full h-full rounded-2xl" value={generatedSteps} max={totalGenerationSteps}></progress>
                </div>
            </div>
            <SettingsDrawer settingsOpen={settingsOpen} closeSettings={toggleSettings} baseSettings={baseSettings} setBaseSettings={setBaseSettings}/>
            <HistoryDrawer historyOpen={historyOpen} closeHistory={toggleHistory} images={images} setPreview={setPreviewImage} queue={queue} deleteTask={deleteTask}/>

            { previewImage &&
                <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full'>
                    <div className='w-full h-full bg-neutral-black opacity-70' onClick={closePreview}></div>
                    <img src={previewImage} className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'></img>
                </div> 
            }
            {/* <div className="flex flex-col basis-1/5 h-full 
                            bg-secondary-coral
                            rounded-lg border-neutral-muted border-2
                            p-5 gap-2">
                <h1 className="text-text-primary text-center text-3xl font-bold">Generation settings</h1>

                <label htmlFor="prompt" className='text-text-primary text-xl'>Prompt</label>
                <textarea className="p-3 rounded-md" id='prompt' type='text' rows="5" placeholder='Type prompt here...' value={prompt} onChange={(e) => setPrompt(e.target.value)}></textarea>

                <label htmlFor="negprompt" className='text-text-primary text-xl'>Negative Prompt</label>
                <textarea className="p-3 rounded-md" id='negprompt' type='text' rows="5" placeholder='Type negative prompt here...' value={negPrompt} onChange={(e) => setNegPrompt(e.target.value)}></textarea>

                <div className='flex flex-row gap-10'>
                    <div className='flex flex-col basis-1/2'>
                        <label htmlFor='steps' className='text-text-primary text-xl'>Steps: {steps}</label>
                        <input className="" type='range' min="1" max="200" step="1"id="steps" value={steps} onChange={(e) => setSteps(e.target.value)}></input>

                    </div>

                    <div className='flex flex-col basis-1/2'>
                        <label htmlFor='cfg' className='text-text-primary text-xl'>Guidance Scale: {cfg}</label>
                        <input className="" type='range' min="1" max="30" step="0.5" id="cfg" value={cfg} onChange={(e) => setCFG(e.target.value)}></input>
                    </div>
                </div>

                <label htmlFor='seed' className='text-text-primary text-xl'>Seed:</label>
                <input className="p-2 rounded-md" type='number' max="10000000" id="seed" value={seed} disabled={randomize} onChange={(e) => setSeed(e.target.value)}></input>
                <div className='flex flex-row gap-2 text-xl'>
                    <label htmlFor='randomizeCheck' className='text-text-primary'>Randomize seed?</label>
                    <input id="randomizeCheck" className="size-6 self-end" type="checkbox" checked={randomize} onClick={toggleRandomize}></input>
                </div>

                <button className="bg-accent-green rounded-md self-center m-5 p-2
                                    hover:bg-blue-900 text-text-primary text-2xl shadow-lg hover:shadow-2xl hover:drop-shadow-2xl
                                    transition-all duration-100 ease-in-out"
                onClick={submitPrompt}>Generate Image</button>
            </div>
            <div className="flex flex-col basis-3/5 h-full bg-transparent items-center">
                <div className={'w-3/4 text-text-primary text-lg ' + (generating == true ? "visible" : "invisible")}>
                    <label htmlFor="generationProgress">Generation steps: {generatedSteps} / {totalGenerationSteps}</label>
                    <progress id="generationProgress" className="w-full" value={generatedSteps} max={totalGenerationSteps}></progress>

                </div>
                {image && <img className="self-center shadow-xl drop-shadow-2xl hover:cursor-pointer hover:border-8 transition-all duration-75 ease-in-out" src={image} style={{ width: "auto", height: "auto" }}/>}
            </div>
            <div className="flex flex-col basis-1/5 h-full p-5 bg-slate-500 bg-opacity-30 rounded-lg border-white border-2">
                <h2 className='text-center text-2xl text-text-primary border-b-2' >Queue</h2>
                <ul className=''>
                    {queue.map((item) => (
                        <li key={item.id}
                            className='text-text-primary text-xl'>{item.id}</li>
                    ))}
                </ul>

            </div>*/}
        </div> 
    )
}

export default App
