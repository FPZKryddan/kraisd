from flask import Flask, request, jsonify
from flask_cors import CORS
import app.diffuser as sd

app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    app.run(debug=True)
