import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { HiOutlineCog8Tooth, HiArrowPath } from "react-icons/hi2";
import SettingsDrawer from './components/SettingsDrawer';
import HistoryDrawer from './components/HistoryDrawer';
import { useSocket } from './hooks/useSocket';
import Progressbar from './components/Progressbar';


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

    const socket = useSocket("http://10.191.108.121:5051/", {
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
                <img className='w-[170px] h-[50px] mt-5 self-center' src='./logo.svg'></img>
                <input className="p-3 rounded-md w-full md:w-1/2 self-center text-text-black placeholder:text-text-muted placeholder:text-center 
                    resize-none" id='prompt' type='text' placeholder='Type prompt here...' value={prompt} onChange={(e) => setPrompt(e.target.value)}></input>

                <div className='flex flex-row gap-4 justify-center'>
                    <button className='size-[50px] bg-neutral-light rounded-full drop-shadow-3xl hover:contrast-150 text-text-primary cursor-pointer md:hidden'>
                        <HiOutlineCog8Tooth className='size-[40px] w-full' onClick={toggleSettings}/>
                    </button>
                    <button className='w-[175px] h-[50px] bg-accent-green rounded-xl drop-shadow-3xl hover:contrast-150 text-text-primary text-2xl font-bold' onClick={submitPrompt}>Generate</button>
                    <button className='size-[50px] bg-neutral-light rounded-full drop-shadow-3xl hover:contrast-150 text-text-primary relative md:hidden'>
                        <HiArrowPath className='size-[40px] w-full' onClick={toggleHistory}/>
                        {queue.length > 0 &&
                            <p className='size-5 leading-5 text-lg absolute top-0 right-0 bg-secondary-coral text-center rounded-full animate-bounce'>{queue.length}</p>
                        }
                    </button>
                </div>


                {image 
                    ? <img className="self-center shadow-xl drop-shadow-2xl max-h-[66%]" src={image} style={{ width: "auto", height: "auto" }} onClick={() => setPreviewImage(image)}/>
                    : <h1 className="self-center text-text-primary text-3xl">No images generated yet! Generate one now!</h1>
                }
                <Progressbar visible={generating} value={generatedSteps} max={totalGenerationSteps} />
            </div>
            <SettingsDrawer settingsOpen={settingsOpen} closeSettings={toggleSettings} baseSettings={baseSettings} setBaseSettings={setBaseSettings}/>
            <HistoryDrawer historyOpen={historyOpen} closeHistory={toggleHistory} images={images} setPreview={setPreviewImage} queue={queue} deleteTask={deleteTask}/>

            { previewImage &&
                <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full'>
                    <div className='w-full h-full bg-neutral-black opacity-70' onClick={closePreview}></div>
                    <img src={previewImage} className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'></img>
                </div> 
            }
        </div> 
    )
}

export default App
