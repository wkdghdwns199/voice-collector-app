// React Mic 및 wav 파일 업로드 테스트 코드

import React, { useState, useEffect } from 'react';
import { ReactMic } from 'react-mic';
import { saveAs } from 'file-saver';
import axios from 'axios';

const WAV_TYPE = 'audio/wav';

const ReactRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLink, setAudioLink] = useState('');
  const [audioFile, setAudioFile] = useState();
  const [recordDuration, setRecordDuration] = useState(5);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [fileName, setFileName] = useState(' ');
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [isMicrophoneAllowed, setIsMicrophoneAllowed] = useState(null);

  const [hexString, setHexString] = useState('');

  const reader = new FileReader();

  reader.onload = function(event) {
    const arrayBuffer = event.target.result;
    const uint8Array = new Uint8Array(arrayBuffer);
    const hexString = uint8Array.reduce(
      (acc, byte) => acc + byte.toString(16).padStart(2,'0'), '');
    setHexString(hexString);
  }


  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setTimeout(() => setIsRecording(false), recordDuration * 1000);
    }
    return () => clearTimeout(timer);
  }, [isRecording, recordDuration]);

  useEffect(() => {
    setFileName(`${YYYYMMDDHHMMSS()}_${gender}${age}_테스트.wav`);
  }, [recordDuration, age, gender]);

  const clearHandle = () => {
    setAudioLink('');
    setIsDownloaded(false);
    setAge('');
    setGender('');
    setSelectedDuration(null);
  };

  const processRecordedAudio = async (recordedAudio) => {

    const audioBuffer = await new AudioContext().decodeAudioData(
      await recordedAudio.blob.arrayBuffer()
    );

    
    const wavData = audioBufferToWav(audioBuffer);
    const wavBlob = new Blob([wavData], { type: WAV_TYPE });

    reader.readAsArrayBuffer(wavBlob);
  
    setAudioFile(wavBlob);

    setAudioLink(URL.createObjectURL(wavBlob));
    setIsDownloaded(true);
  };

  const handleDownload = () => {
    saveAs(audioLink, fileName);
  };

  const handleSubmit = () => {
    const formData = JSON.stringify({
      'fName' : fileName,
      'bytecode' : hexString
    })

    axios.post('/registerNameRoute/inputData/wavUpload/', formData , {
      headers: {
        'Content-Type': 'application/json',
      },
    });    
  }

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 사용자가 마이크 권한을 허용한 경우에만 녹음 시작
      setIsMicrophoneAllowed(true);
      setIsRecording(true);
    } catch (error) {
      // 사용자가 마이크 권한을 거부한 경우
      setIsMicrophoneAllowed(false);
      console.error('Error accessing microphone:', error);
    }
  };

  const handleDurationChange = (duration) => {
    setSelectedDuration(duration);
    setRecordDuration(duration);
  };

  const handleAgeChange = (event) => {
    const inputAge = event.target.value;
    if (!isNaN(inputAge)) {
      setAge(inputAge);
    }
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const isStartButtonDisabled =
    selectedDuration === null ||
    age === '' ||
    gender === '' ||
    isMicrophoneAllowed === false;

  return (
    <div>
      <h1>Audio Recorder</h1>
      {isMicrophoneAllowed === false && (
        <p>
          Microphone access denied. Please allow microphone access in your
          browser settings.
        </p>
      )}

      <ReactMic
        record={isRecording}
        onStop={processRecordedAudio}
        mimeType="audio/webm"
      />
      
      <div>{audioLink && <button onClick={clearHandle}>Clear</button>}</div>
      <div>
        <div>
          {audioLink && isDownloaded && (
            <button onClick={handleDownload}>Download</button>
          )}
        </div>
        <div>
          {audioLink && isDownloaded && (
            <button onClick={handleSubmit}>Submit To Server</button>
          )}
        </div>
        <div>
          {[5, 10, 20, 30].map((duration) => (
            <label key={duration}>
              <input
                type="radio"
                name="duration"
                value={duration}
                checked={selectedDuration === duration}
                onChange={() => handleDurationChange(duration)}
              />
              {`${duration}s`}
            </label>
          ))}
        </div>
        <div>
          <label>
            Age:
            <input type="text" value={age} onChange={handleAgeChange} />
          </label>
        </div>
        <div>
          <label>
            Gender:
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === 'male'}
                onChange={handleGenderChange}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === 'female'}
                onChange={handleGenderChange}
              />
              Female
            </label>
          </label>
        </div>
        <div>
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              disabled={isStartButtonDisabled}
            >
              {isMicrophoneAllowed === false
                ? 'Microphone Access Denied'
                : 'Start'}
            </button>
          ) : (
            <button onClick={() => setIsRecording(false)}>Stop</button>
          )}
        </div>
      </div>
      <div>{audioLink && <audio controls src={audioLink} />}</div>
    </div>
  );
};

// 나머지 코드는 그대로 유지

function audioBufferToWav(buffer) {
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  let byteRate = (sampleRate * numberOfChannels * bitDepth) / 8;
  let blockAlign = (numberOfChannels * bitDepth) / 8;
  let dataSize = (buffer.length * numberOfChannels * bitDepth) / 8;

  let bufferLength = 44 + dataSize; // 44 bytes for header
  let arrayBuffer = new ArrayBuffer(bufferLength);
  let view = new DataView(arrayBuffer);

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      let sample = buffer.getChannelData(channel)[i];
      sample = Math.max(-1, Math.min(1, sample));
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, sample, true);
      offset += 2;
    }
  }

  return arrayBuffer;
}

const YYYYMMDDHHMMSS = () => {
  const currentDate = new Date();
  const yy = currentDate.getFullYear().toString().slice(-2);
  const MM = pad(currentDate.getMonth() + 1, 2);
  const dd = pad(currentDate.getDate(), 2);
  const hh = pad(currentDate.getHours(), 2);
  const mm = pad(currentDate.getMinutes(), 2);
  const ss = pad(currentDate.getSeconds(), 2);
  const formattedDateTime = yy + MM + dd + hh + mm + ss;

  return formattedDateTime;
};

const pad = (number, length) => {
  let word = '' + number;
  while (word.length < length) {
    word = '0' + word;
  }
  return word;
};

export default ReactRecorder;
