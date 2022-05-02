from FeatureExtractor import *
from GA import *
from InputReader import *
from Preprocessor import *
from Scaler import *
from sklearn.model_selection import train_test_split

from Utils import saveModelToDisk, loadModelFromDisk


def plot_fft(fft_signal, frequency_bin_spacing, title):
    plt.plot([(i + 1) * frequency_bin_spacing for i in range(0, len(fft_signal))], fft_signal)
    plt.xlabel('Frequency')
    plt.ylabel('Amplitude')
    plt.title(title)
    plt.show()


def readLabels(filename):
    file = open(filename, 'r')
    labelNames = file.readline()  # header line
    labels = []
    while True:
        line = file.readline()
        if not line:
            break
        args = line.strip().split(",")
        labels.append(int(args[1]))
    return np.array(labels)


def plot(history, count):
    loss = history.history['loss']
    val_loss = history.history['val_loss']
    acc = history.history['accuracy']
    val_acc = history.history['val_accuracy']
    plt.plot([i for i in range(len(loss))], loss)
    plt.plot([i for i in range(len(loss))], val_loss)
    plt.legend(['loss', 'val_loss'])
    plt.xlabel('epochs')
    plt.ylabel('loss')
    plt.title(f'split : {count}')
    plt.show()

    plt.plot([i for i in range(len(loss))], acc)
    plt.plot([i for i in range(len(loss))], val_acc)
    plt.legend(['acc', 'val_acc'])
    plt.xlabel('epochs')
    plt.ylabel('acc')
    plt.title(f'split : {count}')
    plt.show()


if __name__ == '__main__':
    modelName = ''
    # Read input
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

    InputReader = InputReader()
    basepath = './frames\\'
    filepaths = []
    for i in range(1, 105):  # prepare file paths
        filepaths.append(basepath + str(i) + '\\' + 'frame1.wav')
        filepaths.append(basepath + str(i) + '\\' + 'frame2.wav')
        filepaths.append(basepath + str(i) + '\\' + 'frame3.wav')

    raw_signals, sr = InputReader.readSignals(filepaths)  # read frame signals from filepaths
    new_rate = 10000
    resampled_signals = InputReader.resampleAll(sr, new_rate, raw_signals)  # resample with lower sampling rate

    concatenated_signals = []
    for i in range(0, len(resampled_signals), 3):  # concatenate frames
        concatenated = np.concatenate((resampled_signals[i], resampled_signals[i + 1], resampled_signals[i + 2]))
        concatenated_signals.append(concatenated)

    labels = readLabels('labels.txt')  # 0 - unripe 1 - ripe 53 ripe, 51 unripe
    N = len(concatenated_signals[0])

    Preprocessor = Preprocessor()  # Apply Fast Fourier Transform
    fft_signals = Preprocessor.fft_transform(concatenated_signals)

    frequency_bin_spacing = new_rate / N
    frequencies = [(i + 1) * frequency_bin_spacing for i in range(0, len(fft_signals[0]))]
    total_energies = [sum(energy) for energy in fft_signals]
    for i in range(len(fft_signals)):
        for j in range(len(fft_signals[0])):
            fft_signals[i][j] = fft_signals[i][j] / total_energies[i]

    x = []
    for signal in fft_signals:
        x.append(np.array(signal[:500])[chosen_frequencies])

    ann = ANN(x, labels)
    model = ann.trainOne()
    saveModelToDisk(model, modelName)
