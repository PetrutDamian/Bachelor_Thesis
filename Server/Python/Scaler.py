import numpy as np


class Scaler:
    def __init__(self):
        self.__u = None
        self.__std = None
        pass

    def fit(self, x):
        self.__u = np.mean(x)
        self.__std = np.std(x)

    def transform(self, x):
        return [(i - self.__u) / self.__std for i in x]
