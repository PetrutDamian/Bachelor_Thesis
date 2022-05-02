import copy
import random
from random import randint
from multiprocessing import Process
import numpy as np
from matplotlib import pyplot as plt
from sklearn.model_selection import StratifiedKFold
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.layers import Dense
from tensorflow.keras.models import Sequential
from multiprocessing import Pool
from ANN import *
import statistics

def generateARandomPermutation(n):
    perm = [i for i in range(n)]
    pos1 = randint(1, n - 1)
    pos2 = randint(1, n - 1)
    perm[pos1], perm[pos2] = perm[pos2], perm[pos1]
    return perm


def generateRandom01Array(n, rate):
    return np.random.binomial(1, rate, n)


class Chromosome:
    def __init__(self, params, gaParams):
        self.history = []
        self.acc_history = []
        self.parameters = [params, gaParams]
        self.genes = generateRandom01Array(gaParams['nr_genes'], gaParams['init_rate'])
        self.mutation_rate = gaParams['mutation_rate']
        self.fitness = 0
        self.ann_samples = np.array(params['ann_samples'])
        self.labels = np.array(params['labels'])
        self.nr_splits = params['splits']
        self.splitter = StratifiedKFold(self.nr_splits, shuffle=True)
        self.crossover_rate = gaParams['crossover_rate']

    def mutation(self):
        shouldMutate = np.random.binomial(1, self.mutation_rate, len(self.genes))
        for i in range(0, len(self.genes)):
            if shouldMutate[i] == 1:
                self.genes[i] = 1 - self.genes[i]

    def crossover(self, c):
        rnd = np.random.binomial(1, self.crossover_rate, 1)[0]
        if rnd == 0:
            c1 = Chromosome(self.parameters[0], self.parameters[1])
            c2 = Chromosome(self.parameters[0], self.parameters[1])
            c1.genes = copy.deepcopy(self.genes)
            c2.genes = copy.deepcopy(c.genes)
            return c1, c2
        else:
            left = random.randint(0, len(self.genes))
            right = random.randint(0, len(self.genes))
            if left > right:
                left, right = right, left
            c1 = Chromosome(self.parameters[0], self.parameters[1])
            c2 = Chromosome(self.parameters[0], self.parameters[1])
            c1.genes = np.concatenate((self.genes[:left], c.genes[left:right], self.genes[right:]))
            c1.genes = np.concatenate((c.genes[:left], self.genes[left:right], c.genes[right:]))
            return c1, c2

    def evaluateFitness(self):
        data = []
        for i in range(len(self.ann_samples)):
            features = []
            for k in range(len(self.genes)):
                if self.genes[k] == 1:
                    features.append(self.ann_samples[i][k])
            data.append(features)
        data = np.array(data)

        model = ANN(data, self.labels)
        loss, acc = model.crossValidate()
        stdev = statistics.stdev(model.loss_history)
        rel_stdev = (100 * stdev) / loss
        self.fitness = [loss/rel_stdev, acc]
        self.history = model.getHistory()
        self.acc_history = model.acc_history


def evaluateChromosome(c):
    c.evaluateFitness()


class GA:
    def __init__(self, gaParams=None, problParam=None):
        self.gaParams = gaParams
        self.problemParams = problParam
        self.population = []

    def initialisation(self):
        for _ in range(0, self.gaParams['population_size']):
            c = Chromosome(self.problemParams, self.gaParams)
            self.population.append(c)

    def evaluation(self):
        for c in self.population:
            c.evaluateFitness()

    def sortPopulation(self):
        self.population = sorted(self.population, key=lambda x: x.fitness[0], reverse=True)

    def averageFitness(self):
        average_loss = sum(c.fitness[0] for c in self.population) / len(self.population)
        average_acc = sum(c.fitness[1] for c in self.population) / len(self.population)
        return average_loss, average_acc

    def advanceOneGeneration(self):
        new_population = []

        for i in range(len(self.population) // 2 - 2):
            parent1 = self.selection()
            parent2 = self.selection()
            c1, c2 = parent1.crossover(parent2)
            c1.mutation()
            c2.mutation()
            new_population.append(c1)
            new_population.append(c2)

        best5 = self.population[-5:]
        self.population = new_population
        for c in best5:
            self.population.append(c)
        self.evaluation()
        self.sortPopulation()

    def bestChromosome(self):
        best = None
        best_fitness = 10000
        for c in self.population:
            if best_fitness > c.fitness[0]:
                best_fitness = c.fitness[0]
                best = c
        return best
    def selection(self):
        chosen = random.sample(self.population, round(self.gaParams['turnir_size'] * len(self.population)))
        best = None
        best_fitness = 10000
        for c in chosen:
            if best_fitness > c.fitness[0]:
                best = c
                best_fitness = c.fitness[0]
        return best
