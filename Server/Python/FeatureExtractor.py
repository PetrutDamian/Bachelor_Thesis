import copy

import librosa
import matplotlib
import numpy as np
from matplotlib import pyplot as plt
from Utils import fft
import scipy.fftpack as fftpk


def sign(x):
    if x >= 0:
        return 1
    return -1


class FeatureExtractor:
    def __init__(self):
        pass

    def extractSTE(self, samples):
        STE = []
        for sample in samples:
            STE.append(sum([xi * xi for xi in sample]))
        return STE

    def extractZCR(self, samples):
        ZCR = []
        for sample in samples:
            ZCR.append(
                sum([abs(sign(sample[i]) - sign(sample[i - 1]))
                     for i in range(1, len(sample))]) / 2 * len(sample)
            )
        return ZCR
