import os

from Utils import *
import numpy as np
import matplotlib.pyplot as plt
import librosa.display
import scipy.io.wavfile
import wave
import shutil


class ThumpDetector:
    def __init__(self, envFile, frameSize=40, eventFrame=4000):
        self.__rnd = 0
        if os.path.isdir("./frames"):
            shutil.rmtree("./frames")
        os.mkdir("./frames")
        self.__eventFrame = eventFrame
        self.__name = ""
        self.__threshHold = calculateEnvironmentNoiseRMS(envFile)
        self.__frameSize = frameSize
        self.__signal = None
        self.__sr = None
        self.__frames = None
        self.__signalFrames = []

    def analyze(self, soundFile):
        y, sr = librosa.load(soundFile, sr=None)
        self.__signal = y
        self.__sr = sr
        ystr = [
            "[" + str(i) + "-" + str(i + self.__frameSize) + "] -> rms=" + str(self.rmsCalc(y[i:i + self.__frameSize]))
            for i in range(0, y.size, self.__frameSize // 2)]
        y2 = [self.rmsCalc(y[i:i + self.__frameSize]) for i in range(0, y.size, self.__frameSize // 2)]
        self.__frames = y2
        return ystr

    def detectEvents(self, name=""):
        self.__name = name
        i = 4
        frameNr = 0
        if not os.path.isdir("./frames\\" + name):
            os.mkdir("./frames\\" + name)

        while i < len(self.__frames) - 5:
            if self.__isStartFrame(self.__frames[i - 2:i + 1], self.__frames[i + 1:i + 4]):
                self.__rnd += 1
                frameNr += 1
                start = (i + 1) * (self.__frameSize // 2)
                # print("recording:", name, "  detected start frame at sample: ", start)
                i += self.__eventFrame // (self.__frameSize // 2)
                frameSignal = self.__signal[start:start + self.__eventFrame]
                self.__signalFrames.append(frameSignal)
                scipy.io.wavfile. \
                    write('./frames\\' + name + '\\frame' + str(frameNr) + ".wav",
                          self.__sr,
                          frameSignal
                          )
            i += 1

        return frameNr

    def __isStartFrame(self, previous, next):
        rmsPrevious = sum(previous) / len(previous)
        rmsNext = sum(next) / len(next)
        if rmsNext > self.__threshHold * 10 and rmsNext > rmsPrevious * 9:
            return True
        return False

    def rmsCalc(self, signal):
        return manualRMSCalc(signal)

    def processSignal(self, signal):
        rms_frames = [self.rmsCalc(signal[i:i + self.__frameSize]) for i in
                      range(0, signal.size, self.__frameSize // 2)]
        i = 4
        frameNr = 0
        segmented_frames = []
        while i < len(rms_frames) - 5:
            if frameNr == 3:
                break
            if self.__isStartFrame(rms_frames[i - 2:i + 1], rms_frames[i + 1:i + 4]):
                frameNr += 1
                start = (i + 1) * (self.__frameSize // 2)
                i += self.__eventFrame // (self.__frameSize // 2)
                frame = signal[start:start + self.__eventFrame]
                segmented_frames.append(frame)
            i += 1
        concatenated = np.concatenate((segmented_frames[0], segmented_frames[1], segmented_frames[2]))
        scipy.io.wavfile.write("testingtest.wav", 44100, concatenated)
        return concatenated
