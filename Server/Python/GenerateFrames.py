from ThumpDetector import ThumpDetector


def generateFrames(eventFrame, frameSize):
    td = ThumpDetector("envNoise2.wav", eventFrame=eventFrame, frameSize=frameSize)
    for i in range(105, 109):
        filename = str(i) + ".wav"
        if i <= 9:
            filename = "00" + filename
        else:
            filename = "0" + filename
        filename = "./recordings\\" + filename
        td.analyze(filename)
        if td.detectEvents(str(i)) != 3:
            return False
    return True


if __name__ == '__main__':
    generateFrames(3600, 40)
