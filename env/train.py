import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from tensorflow.keras.applications import DenseNet201
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.callbacks import TensorBoard, EarlyStopping, LearningRateScheduler
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from datetime import datetime
import tensorflow as tf

# Define dataset new path and model directory path
dataset_path = 'path_to_your_new_dataset'
model_dir_path = 'model.h5'

# Load dataset
disease_folders = os.listdir(dataset_path)

# Create a DataFrame to store image paths and labels
data = {'Image_Path': [], 'Label': []}

for label, disease_folder in enumerate(disease_folders):
    disease_path = os.path.join(dataset_path, disease_folder)
    images = os.listdir(disease_path)

    for image in images:
        image_path = os.path.join(disease_path, image)
        data['Image_Path'].append(image_path)
        data['Label'].append(label)

df = pd.DataFrame(data)

# Split the dataset into training and validation sets
train_df, val_df = train_test_split(df, test_size=0.2, random_state=42)

# Image preprocessing with data augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

val_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_dataframe(
    train_df,
    x_col='Image_Path',
    y_col='Label',
    target_size=(224, 224),
    batch_size=32,
    class_mode='raw'
)

val_generator = val_datagen.flow_from_dataframe(
    val_df,
    x_col='Image_Path',
    y_col='Label',
    target_size=(224, 224),
    batch_size=32,
    class_mode='raw'
)

# Build a more advanced model (DenseNet201 with fine-tuning)
base_model = DenseNet201(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

model = Sequential()
model.add(base_model)
model.add(GlobalAveragePooling2D())
model.add(Dense(512, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.01)))
model.add(Dropout(0.5))
model.add(Dense(units=len(disease_folders), activation='softmax'))

# Fine-tuning only the top layers
for layer in base_model.layers:
    layer.trainable = False

model.compile(optimizer=Adam(learning_rate=0.0001), loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Learning rate scheduler
def lr_scheduler(epoch, lr):
    if epoch % 5 == 0 and epoch > 0:
        return lr * 0.9  # Reduce learning rate by 10% every 5 epochs
    return lr

lr_schedule = LearningRateScheduler(lr_scheduler)

# TensorBoard setup
log_dir = "logs/fit/" + datetime.now().strftime("%Y%m%d-%H%M%S")
tensorboard_callback = TensorBoard(log_dir=log_dir, histogram_freq=1)

# Early stopping to prevent overfitting
early_stopping = EarlyStopping(monitor='val_loss', patience=8, restore_best_weights=True)

# Train the model
model.fit(train_generator, validation_data=val_generator, epochs=10, callbacks=[tensorboard_callback, early_stopping, lr_schedule])

# Fine-tune the whole model
for layer in model.layers[0].layers:
    layer.trainable = True

# Adjust learning rate for fine-tuning
model.compile(optimizer=Adam(learning_rate=0.00001), loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Save the model
model.save(os.path.join(model_dir_path, 'model.h5'))
