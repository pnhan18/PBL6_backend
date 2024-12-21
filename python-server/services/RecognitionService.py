import cv2
import numpy as np
import mediapipe as mp
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization, Conv1D, MaxPooling1D, Bidirectional, LSTM, GRU
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.mixed_precision import LossScaleOptimizer
from tensorflow.keras.layers import LeakyReLU, Multiply, Input
from tensorflow.keras import layers, optimizers
from collections import deque
import time
import os
import json
import base64
import generated.sign_language_pb2 as signlanguage_pb2

try:
    from tensorflow.keras import mixed_precision
    mixed_precision.set_global_policy('mixed_float16')
    print("Mixed precision enabled.")
except ImportError:
    print("Mixed precision not available.")

class RecognitionService:
    def __init__(self):
        self.mp_holistic = mp.solutions.holistic
        self.sequence = []
        self.sentence = []
        self.threshold = 0.8
        self.previous_action = None
        self.actions = np.array(['hello', 'father', 'love', 'deaf', 'mother', 'no', "idle", "yes", "help", "please", "more", "thankyou",
                                 "dontwant", "finish", "nice_to_meet_you", "how_are_you", "correct", "wrong", "bad", "busy",
                                 "fine", "good", "same", "happy", "so_so", "you", "notyet", "see", "pay_attention", "hearing", "house", "car"])
        self.model = self.load_model()

    class SEblock(tf.keras.layers.Layer):
        def __init__(self, channels, reduction_ratio=16):
            super(RecognitionService.SEblock, self).__init__()
            self.channels = channels
            self.reduction_ratio = reduction_ratio
            self.fc1 = Dense(channels // reduction_ratio, activation='relu')
            self.fc2 = Dense(channels, activation='sigmoid')

        def call(self, inputs):
            squeeze = tf.reduce_mean(inputs, axis=1)
            squeeze = tf.expand_dims(squeeze, axis=1)
            excitation = self.fc1(squeeze)
            excitation = self.fc2(excitation)
            excitation = tf.reshape(excitation, [-1, 1, self.channels])
            return Multiply()([inputs, excitation])

    def load_model(self):
        model = Sequential()

        model.add(Input(shape=(30, 1662)))
        model.add(Conv1D(64, kernel_size=3, activation='relu', padding='same'))
        model.add(MaxPooling1D(pool_size=2))
        model.add(BatchNormalization())  
        model.add(Dropout(0.3))

        model.add(Conv1D(128, kernel_size=3, activation='relu', padding='same'))
        model.add(MaxPooling1D(pool_size=2))
        model.add(BatchNormalization())
        model.add(Dropout(0.3))

        model.add(Bidirectional(LSTM(128, return_sequences=True)))  
        model.add(BatchNormalization())
        model.add(layers.LeakyReLU(alpha=0.01))
        model.add(Dropout(0.3))
        model.add(self.SEblock(256))

        model.add(Bidirectional(GRU(256, return_sequences=True)))
        model.add(BatchNormalization())
        model.add(layers.LeakyReLU(alpha=0.01))
        model.add(Dropout(0.3))
        model.add(self.SEblock(512))

        model.add(Bidirectional(LSTM(512, return_sequences=True)))  
        model.add(BatchNormalization())
        model.add(layers.LeakyReLU(alpha=0.01))
        model.add(Dropout(0.3))
        model.add(self.SEblock(1024))

        model.add(LSTM(256, return_sequences=True))  
        model.add(BatchNormalization())
        model.add(layers.LeakyReLU(alpha=0.01))
        model.add(Dropout(0.3))
        model.add(self.SEblock(256))  

        model.add(LSTM(128, return_sequences=False))  
        model.add(BatchNormalization())
        model.add(layers.LeakyReLU(alpha=0.01))
        model.add(Dropout(0.3))

        model.add(layers.LeakyReLU(alpha=0.01))
        model.add(Dropout(0.3))
        model.add(layers.LeakyReLU(alpha=0.01))
        model.add(Dense(self.actions.shape[0], activation='softmax')) 
        model.load_weights('./models/LSTM_30_90_auge_relu.h5')
        return model

    
    def RecognizeSignLanguage(self, request_iterator, context):
        client_id = None
        result = None

        for request in request_iterator:
            try:
                client_id = request.client_id
                if isinstance(request.data, bytes):
                    data = request.data.decode('utf-8')  # Giải mã bytes thành chuỗi
                else:
                    data = request.data

                data_dict = json.loads(data)

                frames_base64 = data_dict.get('frames', [])

                mp_holistic = mp.solutions.holistic
                with mp_holistic.Holistic(min_detection_confidence=0.8, min_tracking_confidence=0.95) as holistic:
                    for idx, frame_base64 in enumerate(frames_base64):
                        # Loại bỏ tiền tố "data:image/jpeg;base64," trước khi giải mã
                        frame_data = base64.b64decode(frame_base64.split(',')[1])
                        frame_array = np.frombuffer(frame_data, dtype=np.uint8)

                        # Giải mã JPEG thành hình ảnh
                        frame = cv2.imdecode(frame_array, cv2.IMREAD_COLOR)
                        if frame is None:
                            raise ValueError(f"Frame {idx} could not be decoded.")
                        image, results = self.mediapipe_detection(frame, holistic)
                        keypoints = self.extract_keypoints(results)
                        self.sequence.append(keypoints)
                        self.sequence = self.sequence[-30:]
                        if len(self.sequence) == 30:
                            res = self.model.predict(np.expand_dims(self.sequence, axis=0))[0]
                            result = self.actions[np.argmax(res)]
                            print(result)
                    

                return signlanguage_pb2.RecognitionResult(
                    client_id=client_id,
                    result=result,
                )
            except Exception as e:
                print(f"Error processing request: {e}")
                return signlanguage_pb2.RecognitionResult(
                    client_id=client_id,
                    result="Error processing frames.",
                )
    
    def UploadVideo(self, request_iterator, context):
        upload_dir = "uploads"
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)

        file_name = f"uploaded_video_{int(time.time())}.mp4"
        video_path = os.path.join(upload_dir, file_name)
        client_id = None  

        with open(video_path, "wb") as video_file:
            for request in request_iterator:
                video_file.write(request.data)
                client_id = request.client_id

        print(f"Video saved at {video_path}")
        print(f"Client ID: {client_id}")

        txtPath = self.process_video(video_path)
        print(txtPath)

        with open(txtPath, "rb") as f:
            txt_chunk = f.read()
            
        os.remove(txtPath)

        return signlanguage_pb2.RecognitionFileResult(
            client_id=client_id,  # Trả lại client_id đã nhận
            txt_chunk=txt_chunk  # Gửi kết quả dạng bytes
        )

    def process_video(self, video_path):
        cap = cv2.VideoCapture(video_path)

        if not cap.isOpened():
            print("Error: Could not open video.")
            exit()

        # Set target FPS
        target_fps = 5
        video_fps = cap.get(cv2.CAP_PROP_FPS)
        frame_interval = max(int(video_fps / target_fps), 1)
        frame_count = 0

        # Verify GPU usage
        print("Num GPUs Available: ", len(tf.config.list_physical_devices('GPU')))

        # Open file to write WebVTT subtitles
        file_name = f"predictions_{int(time.time())}.vtt"
        path_file = os.path.join("uploads", file_name)
        
        with open(path_file, 'w') as f:
            # Write WebVTT header
            f.write("WEBVTT\n\n")
            
            with self.mp_holistic.Holistic(min_detection_confidence=0.8, min_tracking_confidence=0.8, static_image_mode=False) as holistic:
                while cap.isOpened():
                    ret, frame = cap.read()
                    if not ret:
                        break

                    if frame_count % frame_interval != 0:
                        frame_count += 1
                        continue

                    frame = cv2.resize(frame, (640, 360))
                    image, results = self.mediapipe_detection(frame, holistic)

                    # Extract keypoints
                    keypoints = self.extract_keypoints(results)
                    self.sequence.append(keypoints)

                    if len(self.sequence) == 30:
                        # Convert sequence to numpy array and expand dimensions for batch
                        input_sequence = np.expand_dims(np.array(self.sequence), axis=0).astype(np.float16)  # Use float16 if mixed precision

                        # Make prediction
                        res = self.predict_action(input_sequence)[0].numpy()

                        # Decode prediction
                        action = self.actions[np.argmax(res)]
                        confidence = res[np.argmax(res)]

                        if confidence > self.threshold and action != self.previous_action:
                            current_frame = int(cap.get(cv2.CAP_PROP_POS_FRAMES))
                            
                            # Calculate start and end time for subtitle
                            start_time = self.frame_to_timestamp(current_frame, video_fps)
                            end_time = self.frame_to_timestamp(current_frame + frame_interval, video_fps)
                            
                            # Write subtitle in WebVTT format
                            f.write(f"{start_time} --> {end_time}\n")
                            f.write(f"{action} (Confidence: {confidence:.2f})\n\n")
                            
                            previous_action = action

                            if not self.sentence or action != self.sentence[-1]:
                                self.sentence.append(action)

                        if len(self.sentence) > 5:
                            self.sentence = self.sentence[-5:]

                    frame_count += 1

        cap.release()
        cv2.destroyAllWindows()
        os.remove(video_path)
        return path_file

    def frame_to_timestamp(self, frame, fps):
        """Convert frame number to timestamp in WebVTT format."""
        total_seconds = frame / fps
        hours = int(total_seconds // 3600)
        minutes = int((total_seconds % 3600) // 60)
        seconds = int(total_seconds % 60)
        milliseconds = int((total_seconds - int(total_seconds)) * 1000)
        return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"

    def mediapipe_detection(self, image, model):
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convert BGR to RGB
        image.flags.writeable = False                   # Improve performance
        results = model.process(image)                  # Make prediction
        image.flags.writeable = True                    # Restore image
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR) # Convert back to BGR
        return image, results

    def extract_keypoints(self, results):
        pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33 * 4)
        face = np.array([[res.x, res.y, res.z] for res in results.face_landmarks.landmark]).flatten() if results.face_landmarks else np.zeros(468 * 3)
        lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(21 * 3)
        rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(21 * 3)
        return np.concatenate([pose, face, lh, rh])

    @tf.function
    def predict_action(self, input_sequence):
        return self.model(input_sequence, training=False)