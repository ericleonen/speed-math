import tensorflow as tf
import tensorflowjs as tfjs
from tensorflow import keras

# load MNIST
(train_input, train_label), (test_input, test_label) = keras.datasets.mnist.load_data()

# reshape and scale the data
train_input = train_input.reshape([-1, 28, 28, 1])
test_input = test_input.reshape([-1, 28, 28, 1])
train_input = train_input / 255.0
test_input = test_input / 255.0

# one-hot encode the labels
train_label = keras.utils.to_categorical(train_label)
test_label = keras.utils.to_categorical(test_label)

# create the keras model
model = keras.Sequential([
    keras.layers.Conv2D(32, (5, 5), padding="same", input_shape=[28, 28, 1]),
    keras.layers.MaxPool2D((2, 2)),
    keras.layers.Conv2D(64, (5, 5), padding="same"),
    keras.layers.MaxPool2D((2, 2)),
    keras.layers.Flatten(),
    keras.layers.Dense(1024, activation="relu"),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(10, activation="softmax")
])
model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

# train the model
model.fit(train_input, train_label, validation_data=(test_input, test_label), epochs=1)
test_loss, test_acc = model.evaluate(test_input, test_label)
print("Test accuracy: ", test_acc)

# save as tfjs
tfjs.converters.save_keras_model(model, "models")