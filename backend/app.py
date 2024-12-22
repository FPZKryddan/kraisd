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


task_queue = deque()

clients = []
active_task = {}

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
    client = request.sid
    clients.append(client)
    print(f"{client} client has connected")
    emit("join",{"data":f"id: {client} is connected"})

@socketio.on("queue")
def queue(task):
    print(request.sid)
    # TODO validate prompt data
    task_queue.append({"sid": request.sid, "req": task})

    update_client_queue(request.sid)


def report_progress(pipe, step, timestep, callback_kwargs):
    client = active_task.get("sid")
    socketio.emit("generation_update", {"step": step}, room=client)
    return callback_kwargs


def update_client_queue(client):
    client_queue = [{"id": idx, "item": item.get("req")} for idx, item in enumerate(task_queue) if item.get("sid") == client]
    socketio.emit("get_queue", {"queue": client_queue}, room=client)

def worker():
    while True:
        if task_queue:
            active_task = task_queue.popleft()
            client = active_task.get("sid")
            task = active_task.get("req")
            print(f"processing task: {task}")

            prompt = task.get("prompt")
            negPrompt = task.get("negPrompt")
            steps = int(task.get("steps"))
            cfg = float(task.get("cfg"))
            seed = int(task.get("seed"))
            width = int(task.get("width"))
            height = int(task.get("height"))

            try:
                socketio.emit("generation_started", {"total_steps": steps}, room=client)
                image = sd.generate_image(prompt, negPrompt, steps, cfg, seed, width, height, report_progress)
                socketio.emit("generation_completed", {"image": image}, room=client)
                update_client_queue(client)
            except Exception as e:
                print(f"ERROR: {str(e)}")
        else:
            time.sleep(1)

if __name__ == '__main__':
    #app.run(debug=True)
    print("Listening on port 5000")
    worker_thread = threading.Thread(target=worker, daemon=True)
    worker_thread.start()
    socketio.run(app, debug=True, port=5000)
