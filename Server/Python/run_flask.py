from flask import Flask
from flask import render_template, request

from FeatureExtractor import FeatureExtractor
from Service import Service
from ThumpDetector import ThumpDetector

app = Flask(__name__)
import json


@app.route("/", methods=['POST'])
def hello_world():
    obj = json.loads(request.data.decode('UTF-8'))
    path = obj['path'].replace('/', '\\')
    result = service.checkWatermelonRipeness(path)
    return "ripe" if result == 1 else "unripe"


if __name__ == '__main__':
    thump_detector = ThumpDetector("envNoise2.wav", eventFrame=3600, frameSize=40)
    feature_extractor = FeatureExtractor()
    service = Service("savedModel", thump_detector, feature_extractor)
    app.run(port=5000, debug=True)
