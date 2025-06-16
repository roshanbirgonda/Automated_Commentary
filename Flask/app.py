from flask import Flask, request, jsonify
from moviepy.editor import VideoFileClip
import os

app = Flask(__name__)

def is_video(file_path):
    try:
        if not os.path.isfile(file_path):
            return False
        
        clip = VideoFileClip(file_path)
        return True
    except Exception:
        return False

@app.route('/check-file', methods=['POST'])
def check_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Save file temporarily for checking
    file_path = os.path.join('temp', file.filename)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    file.save(file_path)

    # Check if the file is a video
    if is_video(file_path):
        return jsonify({'message': 'The file is a video.'}), 200
    else:
        return jsonify({'message': 'The file is not a video.'}), 200

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001)
