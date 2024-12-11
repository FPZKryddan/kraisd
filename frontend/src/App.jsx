    import { useState } from 'react'
    import './App.css'

    function App() {
    const [image, setImage] = useState(null);
    const [prompt, setPrompt] = useState(null);
    const api = import.meta.env.VITE_BACKEND_URL;

    const decodeBase64Image = (base64Data, mimeType = "image/jpeg") => {
        return `data:${mimeType};base64,${base64Data}`;
    };

    const handleClick = () => {
        const opts = {
            method: "POST",
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({prompt: prompt})
        }
        fetch(api + 'api', opts)
            .then(response => response.json())
            .then(data => setImage(decodeBase64Image(data.image)));
    }

    return (
        <div className="container w-screen h-screen bg-slate-400">
            <div className="flex flex-col">
                <label>Prompt</label>
                <input className="" type='text' placeholder='Type prompt here...' value={prompt} onChange={(e) => setPrompt(e.target.value)}></input>
                <button onClick={handleClick}>Generate Image</button>
                {image && <img src={image}/>}
            </div>
        </div>
    )
    }

    export default App
