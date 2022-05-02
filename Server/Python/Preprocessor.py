import scipy
import numpy as np


class Preprocessor:
    def __init__(self):
        pass

    def __fft(self, signal):
        return scipy.fft.fft(signal)

    def fft_transform(self, signals):
        transformed = []
        for signal in signals:
            if len(signal) % 2 == 0:
                fft = self.__fft(signal)[1:len(signal) // 2]
            else:
                fft = self.__fft(signal)[1:(len(signal) - 1) // 2 + 1]
            fft_abs = ((np.abs(fft) ** 2) * 2)/len(signal)
            transformed.append(fft_abs)
        return transformed