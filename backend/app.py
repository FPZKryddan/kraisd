from flask import Flask, request, jsonify
from flask_cors import CORS
import app.diffuser as sd

app = Flask(__name__)
CORS(app)

@app.route('/api', methods=["POST"])
def index():
    data = request.get_json()
    prompt = data.get("prompt")
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    image = sd.generate_image(prompt)
    return jsonify({"message": "image generated Successfully!", "image": image}), 200

if __name__ == '__main__':
    app.run(debug=True)
