import librosa


class InputReader:
    def __init__(self):
        pass

    def readSignal(self, filepath):
        signal, sr = librosa.load(filepath, sr=None)
        return signal, sr

    def readSignals(self, filepaths):
        signals = []
        sr = 0
        for filepath in filepaths:
            signal, sr = librosa.load(filepath, sr=None)
            signals.append(signal)
        return signals, sr

    def resampleOne(self, oldRate, newRate, signal):
        resampled = librosa.resample(signal, oldRate, newRate)
        return resampled

    def resampleAll(self, oldRate, newRate, signals):
        resampled = []
        for signal in signals:
            new = librosa.resample(signal, oldRate, newRate)
            resampled.append(new)
        return resampled
