import os
import uuid
import cv2
import subprocess
from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configure upload and output folders
USER_UPLOAD_FOLDER = 'inputs/user'
CLOTH_UPLOAD_FOLDER = 'inputs/cloth'
OUTPUT_FOLDER = 'outputs'

os.makedirs(USER_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CLOTH_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def resize_image(image_path, size=(192, 256)):
    """Resizes an image using OpenCV and overwrites the original file."""
    img = cv2.imread(image_path)
    if img is not None:
        # cv2.resize expects (width, height)
        resized_img = cv2.resize(img, size, interpolation=cv2.INTER_AREA)
        cv2.imwrite(image_path, resized_img)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "ai-service"})

@app.route('/tryon', methods=['POST'])
def tryon():
    # Check if files are part of the POST request
    if 'user_image' not in request.files or 'cloth_image' not in request.files:
        return jsonify({"error": "Missing 'user_image' or 'cloth_image' in the request"}), 400
    
    user_file = request.files['user_image']
    cloth_file = request.files['cloth_image']
    
    # Check if filenames are empty
    if user_file.filename == '' or cloth_file.filename == '':
        return jsonify({"error": "No selected file for user or cloth image"}), 400
        
    # Generate unique UUID filenames while preserving the original extension
    user_ext = os.path.splitext(user_file.filename)[1]
    cloth_ext = os.path.splitext(cloth_file.filename)[1]
    
    user_filename = f"{uuid.uuid4().hex}{user_ext}"
    cloth_filename = f"{uuid.uuid4().hex}{cloth_ext}"
    
    user_path = os.path.join(USER_UPLOAD_FOLDER, user_filename)
    cloth_path = os.path.join(CLOTH_UPLOAD_FOLDER, cloth_filename)
    
    user_file.save(user_path)
    cloth_file.save(cloth_path)
    
    # Resize images before processing
    resize_image(user_path)
    resize_image(cloth_path)
    
    output_filename = f"result_{user_filename}"
    output_path = os.path.join(OUTPUT_FOLDER, output_filename)
    
    # Call CP-VTON test.py using subprocess
    try:
        subprocess.run(
            ["python", "test.py", "--user_image", user_path, "--cloth_image", cloth_path, "--output_path", output_path],
            check=True,
            capture_output=True,
            text=True
        )
    except subprocess.CalledProcessError as e:
        return jsonify({"error": "Model inference failed", "details": e.stderr}), 500
        
    return jsonify({
        "message": "Try-on processing successful",
        "user_image_path": user_path,
        "cloth_image_path": cloth_path,
        "output_image_path": output_path
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)