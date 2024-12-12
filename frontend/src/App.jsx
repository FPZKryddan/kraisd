    import { useState, useEffect, useCallback } from 'react'
    import './App.css'
    import {io} from 'socket.io-client'

    function App() {
        const [image, setImage] = useState(null);

        const [prompt, setPrompt] = useState("");
        const [negPrompt, setNegPrompt] = useState("");
        const [steps, setSteps] = useState(20);
        const [cfg, setCFG] = useState(7);
        const [seed, setSeed] = useState(null);
        const [randomize, setRandomize] = useState(true);

        const [socket, setSocket] = useState(null);
        const [queue, setQueue] = useState([]);

        const [generatedSteps, setGeneratedSteps] = useState(0);
        const [totalGenerationSteps, setTotalGenerationSteps] = useState(0);
        const [generating, setGenerating] = useState(0);
        const api = import.meta.env.VITE_BACKEND_URL;

        useEffect(() => {
            if (!window.socket) {
                window.socket = io("http://localhost:5000/", {
                    transports: ["websocket"], // Ensure WebSocket transport is explicitly used
                    cors: {
                        origin: "*",           // Allow CORS
                    },
                });

                
                window.socket.on("join", (event) => {
                    window.socket.send("Connection established")
                    console.log("connected to server ", event.data)
                });
                
                window.socket.on("leave", () => {
                    console.log("Connection dropped")
                });
                
                window.socket.on("get_queue", (event) => {
                    setQueue(event.queue)
                });
                
                window.socket.on("generation_started", (event) => {
                    setTotalGenerationSteps(event.total_steps)
                    setGenerating(true)
                });
                
                window.socket.on("generation_update", (event) => {
                    setGeneratedSteps(event.step)
                });

                window.socket.on("generation_completed", (event) => {
                    setImage(decodeBase64Image(event.image))
                    setGenerating(false)
                    console.log("recieved image!")
                });

                setSocket(window.socket);

            }
    

        }, [])

        const decodeBase64Image = (base64Data, mimeType = "image/jpeg") => {
            return `data:${mimeType};base64,${base64Data}`;
        };

        const submitPrompt = useCallback(() => {
            // const opts = {
            //     method: "POST",
            //     headers: { 'Content-type': 'application/json' },
            //     body: JSON.stringify({prompt: prompt, negPrompt: negPrompt, steps: steps, cfg: cfg, seed: seed})
            // }
            // fetch(api + 'api', opts)
            //     .then(response => response.json())
            //     .then(data => setImage(decodeBase64Image(data.image)));
            socket.emit("queue", {prompt: prompt, negPrompt: negPrompt, steps: steps, cfg: cfg, seed: seed})
            if (randomize)
                setSeed(Math.floor(Math.random() * 10000000))
        }, [api, prompt, negPrompt, steps, cfg, seed, randomize])

        const handleKeyPress = useCallback((e) => {
            if (e.key == "Enter") {
                submitPrompt()
            }
        }, [submitPrompt])

        const toggleRandomize = () => {
            setRandomize(!randomize)
        }

        useEffect(() => {
            window.addEventListener("keyup", handleKeyPress);

            return () => {
                window.removeEventListener("keyup", handleKeyPress);
            }
        }, [handleKeyPress])

        useEffect(() => {
            if (seed == null)
                setSeed(Math.floor(Math.random() * 10000000))
        }, [seed])

        return (
            <div className="container max-w-full m-0 p-5 h-screen bg-gradient-to-b from-black  to-blue-950 flex flex-row">
                <div className="flex flex-col basis-1/5 h-full bg-slate-500 bg-opacity-30 rounded-lg border-white border-2
                                p-5 gap-2">
                    <h1 className="text-white text-center text-3xl font-bold">Generation settings</h1>

                    <label htmlFor="prompt" className='text-white'>Prompt</label>
                    <textarea className="p-3 rounded-md" id='prompt' type='text' rows="5" placeholder='Type prompt here...' value={prompt} onChange={(e) => setPrompt(e.target.value)}></textarea>

                    <label htmlFor="negprompt" className='text-white'>Negative Prompt</label>
                    <textarea className="p-3 rounded-md" id='negprompt' type='text' rows="5" placeholder='Type negative prompt here...' value={negPrompt} onChange={(e) => setNegPrompt(e.target.value)}></textarea>

                    <div className='flex flex-row gap-10'>
                        <div className='flex flex-col basis-1/2'>
                            <label htmlFor='steps' className='text-white'>Steps: {steps}</label>
                            <input className="" type='range' min="1" max="200" step="1"id="steps" value={steps} onChange={(e) => setSteps(e.target.value)}></input>

                        </div>

                        <div className='flex flex-col basis-1/2'>
                            <label htmlFor='cfg' className='text-white'>Guidance Scale: {cfg}</label>
                            <input className="" type='range' min="1" max="30" step="0.5" id="cfg" value={cfg} onChange={(e) => setCFG(e.target.value)}></input>
                        </div>
                    </div>

                    <label htmlFor='seed' className='text-white'>Seed:</label>
                    <input className="p-2 rounded-md" type='number' max="10000000" id="seed" value={seed} onChange={(e) => setSeed(e.target.value)}></input>
                    <label htmlFor='randomizeCheck' className='text-white'>Randomize seed?</label>
                    <input id="randomizeCheck" type="checkbox" checked={randomize} onClick={toggleRandomize}></input>

                    <button className="bg-blue-600 rounded-md border-2 border-black self-center m-5 p-2
                                        hover:bg-blue-900 text-white text-2xl shadow-lg hover:scale-95 hover:rounded-full 
                                        transition-all duration-100 ease-in-out"
                    onClick={submitPrompt}>Generate Image</button>
                </div>
                <div className="flex flex-col basis-3/5 h-full bg-transparent items-center">
                    <div className={'w-3/4 text-white text-lg ' + (generating == true ? "visible" : "invisible")}>
                        <label htmlFor="generationProgress">Generation steps: {generatedSteps} / {totalGenerationSteps}</label>
                        <progress id="generationProgress" className="w-full" value={generatedSteps} max={totalGenerationSteps}></progress>

                    </div>
                    {image && <img className="self-center shadow-xl drop-shadow-2xl hover:cursor-pointer hover:border-8 transition-all duration-75 ease-in-out" src={image} width={1024} height={1024}/>}
                </div>
                <div className="flex flex-col basis-1/5 h-full p-5 bg-slate-500 bg-opacity-30 rounded-lg border-white border-2">
                    <h2 className='text-center text-2xl text-white border-b-2' >Queue</h2>
                    <ul className=''>
                        {queue.map((item) => (
                            <li key={item.id}
                                className='text-white text-xl'>{item.id}</li>
                        ))}
                    </ul>

                </div>
            </div>
        )
    }

    export default App
