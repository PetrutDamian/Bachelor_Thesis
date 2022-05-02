import librosa
import numpy as np

from InputReader import InputReader
from Utils import loadModelFromDisk, returnChosenFrequencies
from Preprocessor import Preprocessor as PR


class Service:
    def __init__(self, model_path, detector, featureExtractor):
        self.reader = InputReader()
        self.detector = detector
        self.featureExtractor = featureExtractor
        self.model = loadModelFromDisk(model_path)
        self.base_path = 'C:\\Facultate\\Licenta\\App\\Licenta\\Server\\'
        pass


    def checkWatermelonRipeness(self, path):
        y, sr = librosa.load(self.base_path + path)
        segmented = self.detector.processSignal(y)
        resampled = self.reader.resampleAll(44100, 10000, [segmented])
        Preprocessor = PR()  # Apply Fast Fourier Transform
        fft_signals = Preprocessor.fft_transform(resampled)

        total_energy = sum(fft_signals[0])
        for j in range(len(fft_signals[0])):
            fft_signals[0][j] = fft_signals[0][j] / total_energy
        frequencies = returnChosenFrequencies()
        x = []
        x.append(np.array(fft_signals[0][:500])[frequencies])
        predicted = self.model.predict(np.array(x))[0]  # probability output
        return round(predicted[0], 0)
