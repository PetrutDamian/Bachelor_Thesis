import math
from keras.models import model_from_json
from keras.models import model_from_yaml
import librosa
import scipy
import numpy as np
import tensorflow

def fft(signal):
    return scipy.fft.fft(signal)


def calculateEnvironmentNoiseRMS(filename):
    y, sr = librosa.load(filename, sr=None)
    y2s = y[0:sr * 2 - 1]
    myValue = math.sqrt(sum([x * x for x in y2s]) / len(y2s))
    return myValue


def manualRMSCalc(signal):
    return math.sqrt(sum([x * x for x in signal]) / len(signal))


def saveModelToDisk(model, name):
    model.save(name)
    '''
    model_json = model.to_json()
    with open(f'{name}.json', "w") as json_file:
        json_file.write(model_json)
    # serialize weights to HDF5
    model.save_weights(f'{name}.h5')
    '''


def loadModelFromDisk(name):
    model = tensorflow.keras.models.load_model(name)
    return model
    '''
    json_file = open(f'{name}.json', 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)
    # load weights into new model
    loaded_model.load_weights(f'{name}.h5')
    loaded_model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
    return loaded_model
    '''
def returnChosenFrequencies():
    chosen_frequencies = [0, 2, 3, 4, 6, 10, 12, 14, 18, 19, 20, 23, 28, 37, 40, 45, 49, 57, 58, 60, 61, 62, 65, 67, 69,
                          70, 72, 73, 75, 76, 77, 82, 88, 89, 93, 95, 96, 111, 112, 116, 118, 120, 122, 124, 128, 132,
                          133, 134, 137, 138, 139, 141, 144, 146, 147, 151, 152, 161, 165, 167, 169, 170, 172, 173, 174,
                          175, 176, 180, 183, 185, 190, 192, 196, 204, 206, 209, 211, 213, 214, 215, 216, 219, 220, 222,
                          230, 231, 235, 240, 242, 243, 244, 245, 247, 248, 250, 251, 253, 254, 255, 256, 257, 258, 260,
                          262, 264, 265, 266, 270, 271, 273, 274, 275, 279, 283, 285, 288, 289, 290, 292, 301, 308, 310,
                          311, 312, 313, 314, 315, 316, 319, 320, 325, 327, 329, 331, 334, 338, 339, 341, 342, 344, 346,
                          348, 349, 350, 351, 356, 357, 358, 360, 363, 364, 370, 371, 374, 380, 384, 385, 387, 388, 390,
                          392, 394, 396, 402, 403, 407, 409, 410, 411, 412, 414, 415, 417, 420, 421, 422, 427, 431, 436,
                          437, 439, 441, 442, 448, 452, 453, 455, 458, 460, 461, 462, 465, 466, 471, 472, 474, 477, 481,
                          482, 485, 486, 489, 490, 492, 493, 495]
    return chosen_frequencies
