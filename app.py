from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np
import os
import base64
import OCRmodel as ocr
import ImagesProcessing as ip
app = Flask(__name__)

# Tạo thư mục lưu ảnh nếu chưa có
save_dir = "captured_images"
if not os.path.exists(save_dir):
    os.makedirs(save_dir)
ocr_process = None

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/other')
def other():
    return render_template('other.html')

@app.route('/capture', methods=['POST'])
def capture():
    data = request.json
    image_data = data['image']
    image_data = image_data.split(",")[1]
    image_data = np.frombuffer(base64.b64decode(image_data), np.uint8)
    image = cv2.imdecode(image_data, cv2.IMREAD_COLOR)
    image_path = os.path.join(save_dir, "captured_image.jpg")
    cv2.imwrite(image_path, image)
    return jsonify({"message": "Image saved successfully!"})

@app.route('/save_pasted_image', methods=['POST'])
def save_pasted_image():
    data = request.json
    image_data = data['image']
    image_data = image_data.split(",")[1]
    image_data = np.frombuffer(base64.b64decode(image_data), np.uint8)
    image = cv2.imdecode(image_data, cv2.IMREAD_COLOR)
    image_path = os.path.join(save_dir, "pasted_image.jpg")
    cv2.imwrite(image_path, image)
    return jsonify({"message": "Pasted image saved successfully!"})

@app.route('/camocr', methods=['POST'])
def camocr():
    image_path = os.path.join(save_dir, "captured_image.jpg")
    result = DoOCR(image_path)
    return jsonify({"result": result})

@app.route('/imgocr', methods=['POST'])
def imgocr():
    image_path = os.path.join(save_dir, "pasted_image.jpg")
    result = DoOCR(image_path)
    return jsonify({"result": result})


def processImage(image_path):
    ip.process_image(image_path)
    #output_path = ip.save_processed_image(img)
    #return output_path

def DoOCR(image_path):
    processImage(image_path)
    output_path = "processed_images/processed_image.jpg"
    return ocr.OCRing(output_path)


if __name__ == '__main__':
    app.run(debug=True)
#dùng: export PYTORCH_ENABLE_MPS_FALLBACK=1 trong terminal
