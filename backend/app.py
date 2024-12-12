from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import app.diffuser as sd
from collections import deque
import threading 
import time


app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins='*')


prompt_queue = deque()

@app.route('/api', methods=["POST"])
def index():
    data = request.get_json()
    print(data)
    prompt = data.get("prompt")
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    
    negPrompt = data.get("negPrompt")
    
    steps = int(data.get("steps"))
    if not steps:
        return jsonify({"error": "Steps is required"}), 400
    
    cfg = float(data.get("cfg"))
    if not cfg:
        return jsonify({"error": "CFG is required"}), 400
    
    seed = int(data.get("seed"))
    if not seed:
        return jsonify({"error": "Seed is required"}), 400
    
    image = sd.generate_image(prompt, negPrompt, steps, cfg, seed)
    return jsonify({"message": "image generated Successfully!", "image": image}), 200

@socketio.on("connect")
def connected():
    print(request.sid)
    print("client has connected")
    emit("join",{"data":f"id: {request.sid} is connected"})

@socketio.on("queue")
def queue(prompt):
    print(request.sid)
    # TODO validate prompt data
    task = {"sid": request.sid, "req": prompt}
    prompt_queue.append(task)

    update_client_queue(request.sid)


def report_progress(pipe, step, timestep, callback_kwargs):
    socketio.emit("generation_update", {"step": step})
    return callback_kwargs


def update_client_queue(sid):
    client_queue = [{"id": idx, "item": item.get("req")} for idx, item in enumerate(prompt_queue) if item.get("sid") == sid]
    socketio.emit("get_queue", {"queue": client_queue})

def worker():
    while True:
        if prompt_queue:
            task = prompt_queue.popleft()
            client = task.get("sid")
            task = task.get("req")
            print(f"processing task: {task}")

            prompt = task.get("prompt")
            negPrompt = task.get("negPrompt")
            steps = int(task.get("steps"))
            cfg = float(task.get("cfg"))
            seed = int(task.get("seed"))

            try:
                socketio.emit("generation_started", {"total_steps": steps})
                image = sd.generate_image(prompt, negPrompt, steps, cfg, seed, report_progress)
                socketio.emit("generation_completed", {"image": image})
                update_client_queue(client)
            except Exception as e:
                print(f"ERROR: {str(e)}")
        else:
            time.sleep(1)

if __name__ == '__main__':
    #app.run(debug=True)
    worker_thread = threading.Thread(target=worker, daemon=True)
    worker_thread.start()
    socketio.run(app, debug=True, port=5000)
