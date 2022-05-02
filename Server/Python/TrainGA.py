from GA import *
from InputReader import *
from Preprocessor import *
from Scaler import *


def plot_fft(fft_signal, frequency_bin_spacing, title):
    plt.plot([(i + 1) * frequency_bin_spacing for i in range(0, len(fft_signal))], fft_signal)
    plt.xlabel('Frequency')
    plt.ylabel('Power')
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


def plotGA(allBest, allAverage, epoch, label):
    plt.xlabel('generation')
    plt.ylabel(f'fitness[{label}]')
    plt.plot([i for i in range(epoch)], allBest)
    plt.plot([i for i in range(epoch)], allAverage)
    plt.legend(['Best', 'Average'])
    plt.title(f"Population size: {GA_PARAMS['population_size']} epochs:{epoch}")
    plt.show()


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


def examineBest(best, epoch=''):
    print(f' Fitness: {best.fitness}')
    indexes = []
    for i in range(0, len(best.genes)):
        if best.genes[i] == 1:
            indexes.append(i)

    print(f'ratio of chosen per total: {len(indexes) / len(best.genes)}')
    print("Indexes:")
    print(indexes)
    print('-------------------------')
    q = [(index + 1) * frequency_bin_spacing for index in indexes]
    plt.plot(q, [1 for x in q], '.')
    plt.xlabel('frequency')
    plt.title(f'chosen frequencies :  {epoch} ')
    plt.show()

    history = best.history
    for i in range(len(history)):
        plot(history[i], f'{i} {epoch} accuracy:{best.acc_history[i]} mean: {best.fitness[1]}')


if __name__ == '__main__':

    # Read input
    InputReader = InputReader()
    basepath = './frames/'
    filepaths = []
    for i in range(1, 105):  # prepare file paths
        filepaths.append(basepath + str(i) + '/' + 'frame1.wav')
        filepaths.append(basepath + str(i) + '/' + 'frame2.wav')
        filepaths.append(basepath + str(i) + '/' + 'frame3.wav')

    raw_signals, sr = InputReader.readSignals(filepaths)  # read frame signals from filepaths
    new_rate = 10000
    resampled_signals = InputReader.resampleAll(sr, new_rate, raw_signals)  # resample with lower sampling rate

    concatenated_signals = []
    for i in range(0, len(resampled_signals), 3):  # concatenate frames
        concatenated = np.concatenate((resampled_signals[i], resampled_signals[i + 1], resampled_signals[i + 2]))
        concatenated_signals.append(concatenated)

    labels = readLabels('./labels.txt')  # 0 - unripe 1 - ripe 53 ripe, 51 unripe
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
    for signal in fft_signals:  # only consider first 500 frequencies
        x.append(signal[:500])

    GA_PARAMS = {'population_size': 101,
                 'mutation_rate': 0.1,
                 'init_rate': 0.2,
                 'nr_genes': len(x[0]),
                 'no_epochs': 3,
                 'turnir_size': 0.3,
                 'crossover_rate': 0.9
                 }
    ANN_PARAMS = {
        'ann_samples': x,
        'labels': labels,
        'splits': 4
    }
    print("starting GA with params:")
    print(GA_PARAMS)
    GA = GA(GA_PARAMS, ANN_PARAMS)
    GA.initialisation()
    GA.evaluation()

    allBestFitness_acc = []
    allBestFitness_loss = []
    allAverageFitness_acc = []
    allAverageFitness_loss = []
    best = None
    epochs = [i for i in range(0, GA_PARAMS['no_epochs'])]
    for epoch in epochs:
        print(f'epoch : {epoch}')
        best_crt = GA.bestChromosome()
        if best is None or best.fitness[0] > best_crt.fitness[0]:
            best = best_crt
        allBestFitness_acc.append(best_crt.fitness[1])
        allBestFitness_loss.append(best_crt.fitness[0])
        average_loss, average_acc = (GA.averageFitness())
        allAverageFitness_acc.append(average_acc)
        allAverageFitness_loss.append(average_loss)

        GA.advanceOneGeneration()
        if epoch % 5 == 0:
            examineBest(best, epoch=f' Epoch {epoch}')
            plotGA(allBestFitness_acc, allAverageFitness_acc, epoch + 1, "accuracy")
            plotGA(allBestFitness_loss, allAverageFitness_loss, epoch + 1, "loss")

    plotGA(allBestFitness_acc, allAverageFitness_acc, len(epochs), "accuracy")
    plotGA(allBestFitness_loss, allAverageFitness_loss, len(epochs), "loss")
    examineBest(best, GA_PARAMS['no_epochs'])

'''
    for i in range(0, 4):
        plt.plot(frequencies_bands, bands_energy[i], 'o')
        plt.ylabel("amplitude")
        plt.xlabel("frequency-ranges")
        plt.title("sample " + str(i) + ("ripe" if labels[i] == 1 else "unripe"))
        plt.show()
    '''

# for i in range(0, 4):
#    plot_fft(normalized[i], frequency_bin_spacing, 'ripe' if labels[i] == 1 else 'unripe')
