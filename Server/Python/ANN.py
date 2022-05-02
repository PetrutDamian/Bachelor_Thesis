from sklearn.model_selection import StratifiedKFold
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.layers import Dense
from tensorflow.keras.models import Sequential
import tensorflow as tf
import numpy as np
from sklearn.model_selection import train_test_split
from matplotlib import pyplot as plt

from Scaler import Scaler


class ANN:
    def __init__(self, x, y, splits=4):
        self.__history = []
        self.acc_history = []
        self.__splits = splits
        self.__x = np.array(x)
        self.__y = np.array(y)
        self.__splitter = StratifiedKFold(splits, shuffle=True)
        self.__model = Sequential()
        self.__model.add(Dense(60, activation='relu', kernel_initializer='he_normal', input_shape=(len(x[0]),)))
        self.__model.add(tf.keras.layers.Dropout(0.4))
        self.__model.add(Dense(40, activation='relu', kernel_initializer='he_normal', input_shape=(len(x[0]),)))
        self.__model.add(tf.keras.layers.Dropout(0.4))
        self.__model.add(Dense(1, activation='sigmoid'))
        self.__model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
        self.__es = EarlyStopping(monitor='val_loss', patience=15, verbose=0)
        self.scaler = Scaler()
        self.loss_history = []

    def crossValidate(self):
        self.__history = []
        self.acc_history = []
        self.loss_history = []
        mean_acc = 0
        mean_loss = 0
        count = 0

        for train_index, test_index in self.__splitter.split(self.__x, self.__y):
            count += 1
            x_train = self.__x[train_index]
            x_test = self.__x[test_index]
            y_train = self.__y[train_index]
            y_test = self.__y[test_index]
            X_train = [[] for i in x_train]
            X_test = [[] for i in x_test]

            for nr_feature in range(len(x_train[0])):
                col = x_train[:, nr_feature].tolist()
                self.scaler.fit(col)
                transformed = self.scaler.transform(col)
                transformed2 = self.scaler.transform(x_test[:, nr_feature].tolist())
                for i in range(len(transformed)):
                    X_train[i].append(transformed[i])
                for i in range(len(transformed2)):
                    X_test[i].append(transformed2[i])
                X_test = np.array(X_test)
                X_train = np.array(X_train)
            history = self.__model.fit(X_train, y_train, epochs=2000, batch_size=len(X_train), callbacks=[self.__es],
                                       verbose=0,
                                       validation_data=(X_test, y_test))
            self.__history.append(history)

            loss, acc = self.__model.evaluate(X_test, y_test, verbose=0)
            mean_acc += acc
            mean_loss += loss
            self.acc_history.append(acc)
            self.loss_history.append(loss)
        return mean_loss / self.__splits, mean_acc / self.__splits

    def trainOne(self):
        X_train, X_test, y_train, y_test = train_test_split(self.__x, self.__y, test_size=0.25)
        self.__model.fit(X_train, y_train, epochs=2000, batch_size=len(X_train), callbacks=[self.__es],
                         verbose=0,
                         validation_data=(X_test, y_test))
        self.__model.evaluate(X_test, y_test, verbose=0)
        return self.__model

    def getHistory(self):
        return self.__history

    def evaluate(self, x_test, y_test):
        return self.__model.evaluate(x_test, y_test, verbose=0)
