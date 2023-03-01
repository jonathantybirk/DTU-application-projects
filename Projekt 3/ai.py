import pandas
from sklearn.model_selection import train_test_split
from sklearn import tree
from matplotlib import pyplot


# DATA SELECTION AND PREPARATION
data = pandas.read_csv('winequality-red.csv')

# simplify wine quality to 'good' or 'not good'
def labelQuality(value):
    if value >= 7:
        return 'good'
    else:
        return 'not good'

data['quality'] = data['quality'].apply(labelQuality)

# split data for training and testing
trainData, testData = train_test_split(data, test_size=0.2)

# define input and target data
trainX, trainY = trainData.drop('quality', axis='columns'), trainData['quality']

testX, testY = testData.drop('quality', axis='columns'), testData['quality']


# MODELLING
model = tree.DecisionTreeClassifier().fit(trainX, trainY)


# PREDICTING
accuracy = model.score(testX, testY)


# EXTRACTION
inputFeatureNames = ['fixed acidity','volatile acidity','citric acid','residual sugar','chlorides','free sulfur dioxide','total sulfur dioxide','density','pH','sulphates','alcohol']

# console
print()
print(tree.export_text(model, feature_names=inputFeatureNames))
print()
print("Accuracy: " + str(accuracy))
print()

# visual
'''
pyplot.figure(figsize=[125,10])

tree.plot_tree(
    model, feature_names=inputFeatureNames, class_names=trainY.unique(),
    fontsize=6, filled=True, rounded=True,
)

pyplot.savefig('tree', dpi=200)
'''