import os
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS extension
import tensorflow as tf

# Flask Backend
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes in your app

# Define dataset path and model directory path
model_dir_path = 'model.h5'


# Load the model once during startup
loaded_model = tf.keras.models.load_model(os.path.join(model_dir_path, 'model.h5'))

# Diseases information
diseases_info = {
    'Alternaria leaf': {'medicine': 'Liquid Copper Fungicide', 'instructions': 'Apply every 7-10 days as needed.'},
    'Apple mosaic': {'medicine': 'Once trees are infected, there is no way to eliminate or manage apple mosaic', 'instructions': 'Remove the tree and replace it.'},
    'Apple rust': {'medicine': 'Fungicides with the active ingredient Myclobutanil', 'instructions': 'Spray trees and shrubs when flower buds first emerge until spring weather becomes consistently warm and dry.'},
    'Apple scab': {'medicine': 'Captan ', 'instructions': 'Per acre in 20 to 200 gallons of water using ground equipment or in 10 to 20 gallons of water by air.'},
    'Black rot': {'medicine': 'Captan and sulfur products', 'instructions': 'Read the manual on the box.'},
    'Brown rot': {'medicine': 'Captan and sulfur products', 'instructions': 'Read the manual on the box.'},
    'Healthy apple': {'medicine': 'No specific medicine', 'instructions': 'Maintain good practices.'},
    'Healthy leaf': {'medicine': 'No specific medicine', 'instructions': 'Maintain good practices.'},
    'Powdery mildew': {'medicine': 'Myclobutanil and fenbuconazole.', 'instructions': 'Applied 1 hour before rainfall.'},
    'Sooty blotch': {'medicine': 'Strobilurin fungicide, kresxim methyl, or trifloxystrobin', 'instructions': 'Read the manual on the box.'}
}

# Enable CORS for all routes in your app
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/predict', methods=['POST'])
def predict():
    try:
        image_file = request.files['image']
        image = cv2.imdecode(np.frombuffer(image_file.read(), np.uint8), cv2.IMREAD_COLOR)
        image = cv2.resize(image, (224, 224))
        image = image / 255.0  # Rescale pixel values to the range [0, 1]
        image = np.expand_dims(image, axis=0)

        prediction = loaded_model.predict(image)
        predicted_class = np.argmax(prediction)

        # Use a consistent mapping between class indices and class labels
        class_labels = list(diseases_info.keys())
        predicted_label = class_labels[predicted_class]

        result = {
            'disease_label': predicted_label,
            'medicine': diseases_info.get(predicted_label, {}).get('medicine', 'Not specified'),
            'instructions': diseases_info.get(predicted_label, {}).get('instructions', 'Not specified')
        }

        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    # Run the app without Gunicorn on a specific port (e.g., 8000)
    app.run(debug=True, threaded=True, host='0.0.0.0', port=8000)
