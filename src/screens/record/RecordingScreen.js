import React, { useState, useEffect } from 'react';
import { ReactMic } from 'react-mic';
import InitialBackground from "../../components/styledComponent/InitialBackground"
import Text from "../../components/styledComponent/Text"
import LoadingContainer from '../../components/styledComponent/record/LoadingContainer';
import OuterCircle from '../../components/styledComponent/record/OuterCircle';
import InnerCircle from '../../components/styledComponent/record/InnerCircle';
import SmallInnerCircle from '../../components/styledComponent/record/SmallInnerCircle';
import WordContainer from '../../components/styledComponent/record/WordContainer';
import Word from '../../components/styledComponent/record/Word';
import ColumnDiv from '../../components/styledComponent/ColumnDiv';
import SmallButton from '../../components/styledComponent/SmallButton';
import Modal from '../../components/styledComponent/Modal';
import ColnumnDiv from '../../components/styledComponent/ColumnDiv';
import RecordVolumeChecker from '../../components/styledComponent/record/RecordVolumeChecker';
import RecordingCheckDiv from '../../components/styledComponent/record/RecordingCheckDiv';
import RowDivForWords from '../../components/styledComponent/record/RowDivForWords';
import { recordSubmit } from '../../api/record/recordSubmit';
import { supabase } from '../../api/supabase';
const RecordingScreen = ({rootNavigateTo, recordNavigateTo, wordData}) => {
    const [progress, setProgress] = useState(0);
    const [recordingStatus, setRecordingStatus] = useState(false);
    const [count, setCount] = useState(10);
    const [diameter, setDiameter] = useState(40);
    const [outerCircleDiameter, setOuterCircleDiameter] = useState(230);
    const [innerCicleDiameter, setInnerCircleDiameter] = useState(230);
    const [smallerDiamemter, setSmallerDiameter] = useState(184)
    const [guidePositionTop, setGuidePositionTop] = useState(20)
    const [guidePositionRight, setGuidePositionRight] = useState(50)
    const [word, setWord] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [wordDatas, setWordDatas] = useState(wordData)
    const [endStatus, setEndStatus] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [audioLink, setAudioLink] = useState('');
    const [audioFile, setAudioFile] = useState();
    const [recordDuration, setRecordDuration] = useState(5);
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [fileName, setFileName] = useState('');
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [isMicrophoneAllowed, setIsMicrophoneAllowed] = useState(false);
    const [hexString, setHexString] = useState('');
    const [fileNameList, setFileNameList] = useState([]);
    const [blobUrl, setBlobUrl] = useState();
    const [hexStringList, setHexStringList] = useState([]);
    const [recordButtonColor, setRecordButtonColor] = useState('#FF6161');
    const [modalOpen, setModalOpen] = useState(false)
    const [loadingModalOpen, setLoadingModalOpen] = useState(false)
    const [volume, setVolume] = useState(0);
    const [volumeColor, setVolumeColor] = useState('#FF0606')
    const [recordVolume, setRecordVolume] = useState(0)
    const [recordCount, setRecordCount] = useState(0)
    const [wordFontSize, setWordFontSize] = useState('7vh')
    const name = window.sessionStorage.getItem('name');
    const age = window.sessionStorage.getItem('age');
    const gender = window.sessionStorage.getItem('gender');
    const doctorId = window.sessionStorage.getItem('doctorId');
    const patientId = window.sessionStorage.getItem('patientId');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const reader = new FileReader();
    const WAV_TYPE = 'audio/wav';
    // 화면 너비 설정 함수
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
  const handleErrorRedirect = () => {
    alert('단어를 가져오는데 실패하였습니다. 관리자에게 문의 바랍니다.')
    recordNavigateTo('RecordInfoScreen')
  }
  // TODO : 단어 supabase 에서 가져와서 띄우기
    const getWords = async () => {
      const {data, error} = await supabase
      .from('recording_terms')
      .select('*')
      setWordDatas(JSON.stringify(data))
    }
    // 가로로 화면이 길 때 녹음 버튼 안내 화살표 이미지 위치 설정
    const setWidthMode = () => {
      setGuidePositionRight(50)
      setGuidePositionTop(20)
    }
    // 세로로 화면이 길 때 녹음 버튼 안내 화살표 이미지 위치 설정
    const setHeightMode = () => {
      setGuidePositionRight(20)
      setGuidePositionTop(30)
    }
    // 화면 로딩 전 초기 설정
    useEffect(() => {
      // 스크롤 맨 위 초기화
      window.scrollTo(0,0)
      // 화면 너비 설정 함수
      window.addEventListener('resize', handleResize);
      // 녹음 버튼, 음량 체크 원 사이즈 변경 함수
      const updateDiameter = () => {
        // 화면 현재 너비, 현재 높이 받아오기
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        // 너비가 높이보다 크면 setWidthMode 아니면 setHeightMode
        windowWidth > windowHeight ? setWidthMode() : setHeightMode()
        // 음량 체크 원 사이즈 조절 함수
        const newDiameter = Math.min(windowWidth/24, windowHeight/24);
        // 녹음 버튼 외부 원 지름 조절 함수
        const newOuterDiameter = Math.min(windowWidth/4.26, windowHeight/4.26);
        // 녹음 버튼 내부 원 지름 조절 함수
        const newInnerDiameter = Math.min(windowWidth/4.26, windowHeight/4.26);
        // 녹음 버튼 내부의 작은 원 지름 조절 함수
        const newSmallerDiameter = Math.min(windowWidth/5.33, windowHeight/5.33);
        // 설정된 지름 값 state 변경
        setDiameter(newDiameter);
        setOuterCircleDiameter(newOuterDiameter);
        setInnerCircleDiameter(newInnerDiameter);
        setSmallerDiameter(newSmallerDiameter);
      };  
      // 녹음 버튼, 음량 체크 원 지름 화면에 따른 설정 함수
      window.addEventListener('resize', updateDiameter);
      updateDiameter();
      // 녹음 관련 변수들 설정
      let mediaStream = null;
      let audioContext = null;
      let analyser = null;
    // 마이크 음량에 따른 색깔 변경 함수
    const checkMicrophoneVolume = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(mediaStream);
        source.connect(analyser);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const updateVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          // 현재 들어오는 마이크 음량의 평균값 구하기
          const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
          // 평귭 값이 15 이상이면 초록색, 아니면 빨간색으로 변경
          average >= 15 ? setVolumeColor('#05CB00') : setVolumeColor('#FF0606')
          // 현재 볼륨 state 값 변경
          setVolume(average);
          requestAnimationFrame(updateVolume);
        };
        updateVolume();
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };
    // 마이크 음량에 따른 색깔 변경 함수
    checkMicrophoneVolume();
    // 화면에서 벗어나면 event listener 다 제거
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      if (audioContext) {
        audioContext.close();
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', updateDiameter);
    };
    },[])
    // 단어 카운트가 실행되면 실행되는 useEffect
    useEffect(() => {
      // 아직 끝이 아니면
      if (wordCount < wordDatas.length ) {
        // 다음 단어 로딩
        setWord(wordDatas[wordCount].term)
        // 저번에 있었던 녹음 파일 이름은 초기화
        setFileName('')
        // 단어의 길이에 따라 단어 사이즈 조절
        if (0 <= wordDatas[wordCount].term.length && wordDatas[wordCount].term.length <= 4){
          setWord(createLineElements(wordData[wordCount].term, '7vh'))
          setWordFontSize('7vh')
        }
        else if (5 <= wordDatas[wordCount].term.length && wordDatas[wordCount].term.length <= 10){
          setWord(createLineElements(wordData[wordCount].term, '6.5vh'))
          setWordFontSize('6.5vh')
        }
        else {
          setWord(createLineElements(wordData[wordCount].term, '5vh'))
          setWordFontSize('4vh')
        }
      }
      // 단어들이 모두 카운트가 되었으면 서버로 녹음 파일들 보내기
      else {
        handleBackEndSend();
      }
      // 끝이라면 state 값 True로 변경
      setEndStatus(wordCount >= wordDatas.length -1)
    },[wordCount]) 
     // audio 버에서 wav 파일로 변경 함수
    const audioBufferToWav = (buffer) => {
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
    reader.onload = function(event) {
      const arrayBuffer = event.target.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      const hexString = uint8Array.reduce(
        (acc, byte) => acc + byte.toString(16).padStart(2,'0'), '');
      setHexString(hexString);
    }
    // 녹음이 시작되면 카운트 시작
    useEffect(() => {
      let timer;
      if (isRecording) {
        timer = setTimeout(() => setIsRecording(false), recordDuration * 1000);
      }
      return () => clearTimeout(timer);
    }, [isRecording, recordDuration]);
    // 현재 날짜 string 보내주기
    const currentDate = () => {
        const date = new Date();
        const currentDate = date.getFullYear()+"-" + (date.getMonth() + 1) + "-" + date.getDate()+ "-" +
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        return currentDate
    }
    // 녹음된 오디오 파일 처리 함수
    const processRecordedAudio = async (recordedAudio) => {
      // blobUrl 추출
      setBlobUrl(recordedAudio.blobUrl)
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
    // 녹음이 되고 있을 때 동작들 관리 함수
    const handleStartRecording = async () => {
        // 브라우저에서 마이크 권한이 허용되어있으면 녹음 시작, 아니면 에러 메세지 띄우기
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setIsMicrophoneAllowed(true);
        } catch (error) {
          // 사용자가 마이크 권한을 거부한 경우
          setIsMicrophoneAllowed(false);
          console.error('Error accessing microphone:', error);
        }
      };
      // 녹음 중에는 녹음 버튼 UI 설정, 녹음이 끝나면 녹음 파일명 배열에 추가
      // 시간에 따라서 녹음 프로세스 바 진행
      // 파일 명 날짜_나이_성별_의사ID_환자ID_영어단어.wav
      useEffect(() => {
        if (recordingStatus){
            const intervalId = setInterval(() => {
                setProgress((prevProgress) => (
                    prevProgress === 359 ? (
                       // 녹음 로딩창이 끝나면 녹음 status false로 변경
                        setRecordingStatus(false),
                        // 진행도 0으로 변경
                        setProgress(0),
                        // 현재 녹음 상태 false로 변경
                        setIsRecording(false),
                        // 녹음 버튼 빨간색으로 변경
                        setRecordButtonColor('#FF6161'),
                        // 녹음 파일명 배열에 추가
                        setFileName(`${currentDate()}_${age}_${gender}_${doctorId}_${patientId}_${wordDatas[wordCount].english_name}.wav`) 
                    ) : (prevProgress + 1) % 360
                ));
            }, (count*1000)/360);
            // 녹음 시간 카운트 다운 기능
            const intervalCount = setInterval(() => {
                setCount((prevCount) => {
                  if (prevCount === 0) {
                    clearInterval(intervalCount);
                    return prevCount;
                  }
                  return prevCount - 1;
                });
              }, 1000);
            return () => clearInterval(intervalId, intervalCount);
        }
    }, [recordingStatus]);
    // 녹음 제한시간 카운트 다운 관리
      const handleRecordCountDown = () => {
        // 현재 녹음하는 상태가 아니고 마이크가 허용되어 있다면
        if (!recordingStatus && isMicrophoneAllowed){
            // 녹음 제한시간 설정
            setCount(wordDatas[wordCount].recording_time)
            setRecordDuration(wordDatas[wordCount].recording_time)
            // 녹음 상태 true 로 변경
            setRecordingStatus(true);
            // 녹음 버튼 회색으로 변경
            setRecordButtonColor('#CECECE');
            // 녹음 상태 true 로 변경
            setIsRecording(true);
        } 
        // 현재 녹음하는 상태가 아니고 마이크가 허용되어 있지 있다면
        else if (!recordingStatus && !isMicrophoneAllowed){
          setRecordCount(0)
          setRecordVolume(0)
          handleStartRecording(true);
        }
        // 녹음 상태라면
        else if (recordingStatus) {
          // 녹음 상태 false 싱태 변경
          setRecordingStatus(false)
          // 녹음 진행도 0으로 설정
          setProgress(0)
          setIsRecording(false)
          // 녹음 버튼 빨간색으로 변경
          setRecordButtonColor('#FF6161')
          // 녹음 파일 이름 설정
          setFileName(`${currentDate()}_${age}_${gender}_${doctorId}_${patientId}_${wordDatas[wordCount].english_name}.wav`) 
        }
    }
    // 다음 단어 관련 함수
    const handleNextWord = async () => {
      // 현재 단어 카운트가 전체 단어 카운트보다 작으면 다음 단어로 넘어간다
      if (wordCount < wordDatas.length) {
        // 현재까지의 녹음 파일 이름들을 가져온다
        const tempFileNameList = [...fileNameList]
        // 현재까지의 녹음 파일들을 가져온다
        const tempHexStringList = [...hexStringList]
        // 현재까지의 녹음 파일 이름들 리스트에 새로운 녹음 파일 이름을 넣는다.
        tempFileNameList.push(fileName)
        // 현재까지의 녹음 파일 리스트에 새로운 녹음 파일을 넣는다.
        tempHexStringList.push(audioFile);
        // 새롭게 업데이트된 녹음 파일 이름 리스트 state 를 변경한다
        setFileNameList(tempFileNameList)
        // 새롭게 업데이트된 녹음 파일 리스트 state 를 변경한다
        setHexStringList(tempHexStringList);
        // 단어 카운트를 1 올린다.
        setWordCount(wordCount+1);
      }
      else {
        // 서버에 녹음 파일들을 보낸다
        handleBackEndSend();
      }
    }
    // 이전 단어로 이동할 때 
    const handlePrevWord = async() => {
      // 녹음 상태를 false 로 변경
      setRecordingStatus(false)
      // 녹음 버튼 색깔 빨간색으로 변경
      setRecordButtonColor('#FF6161')
      // 현재 녹음 진행도 0 으로 변경
      setProgress(0)
      // 만약 단어 카운트가 전체 단어 리스트보다 크거나 같으면 
      if (wordCount >= wordDatas.length){
        // 현재 녹음 파일 이름들 리스트에서 맨 뒤 2개를 자르고 리스트 생성
        const tempFileNameList = fileNameList.slice(0,wordCount-2)
        // 현재 녹음 파일들 리스트에서 맨 뒤 2개를 자르고 리스트 생성
        const tempHexStringList = hexStringList.slice(0,wordCount-2)
        // 리스트 state 변경
        setFileNameList(tempFileNameList)
        // 리스트 state 변경
        setHexStringList(tempHexStringList);
        // 단어 카운트를 -2 만큼 내린다
        setWordCount(wordCount-2);
        return;
      }
      // 만약 단어 카운트가 -1 를 했을 때 0 이 아니라면
      if (wordCount -1 !== 0){
        // 현재 녹음 파일 이름 리스트에서 맨 뒤를 자르고 리스트 생성
        const tempFileNameList = fileNameList.slice(0,wordCount-1)
        // 현재 녹음 파일 리스트에서 맨 뒤를 자르고 리스트 생성
        const tempHexStringList = hexStringList.slice(0,wordCount-1)
        // 리스트 state 변경
        setFileNameList(tempFileNameList)
        setHexStringList(tempHexStringList);
      }
      // 만약 맨 마지막이었다면 리스트 초기화
      else {
        setFileNameList([])
        setHexStringList([]);
      }
      // 단어 카운트 -1 내림
      setWordCount(wordCount-1);
    }
    // supabase로 녹음 파일들 보내기
    const handleBackEndSend = async () => {
      recordSubmit(fileNameList, hexStringList, doctorId, patientId, recordNavigateTo, setLoadingModalOpen)
    }
    // 녹음 파일들 제출 관련 함수
    const handleSubmit = async () => {
       // 다음 단어 처리 함수를 거쳐서 제출로 보내기
        await handleNextWord()
        // handleBackEndSend()
    }
    // 뒤로 가기 처리 함수
    const handleGoBack = () => {
      recordNavigateTo('RecordInfoScreen')
    }
    // 녹음 도움말 Modal 띄우기
  const handleOpenModal = () => {
    // 만약 이미 열려있거나 녹음 중이라면 false 
    if (modalOpen ||isRecording) {
     setModalOpen(false)}
     // 아니면 true
     else {
       setModalOpen(true)    
     }
   }
   // 녹음 도움말 닫기 버튼
    const handleCloseModal = () => {
      setModalOpen(false)
    }
    // 단어가 너무 길면 줄바꿈 하는 함수
      const createLineElements = (str, size) => {
    // 문자열을 공백 문자(' ')를 기준으로 나눈다.
    const lines = str.split(' ');
    // 각 줄에 대해 div 요소로 감싸고, margin-bottom을 추가한다.
    const elements = lines.map((line, index) => (
      <Word key={index} style={{ fontSize:size, marginBottom: 10}}>{line}</Word>
    ));
    return elements;
  };
  return (
    <InitialBackground>
    { modalOpen && (
      <Modal>
        <Text style={{color:'black',fontSize: '3vh', marginBottom:'3vh'}}>"녹음" 도움말</Text>
        <ColnumnDiv style ={{alignItems:'flex-start', height:'15vh'}}>
          <Text style={{color:'black',  marginBottom: '2vh',fontSize:'1.7vh'}}>1. 녹음하기 전 조용한 환경을 만들어주세요.</Text>
          <Text style={{color:'black',  marginBottom: '2vh',fontSize:'1.7vh'}}>2. 위에 있는 따라 읽을 단어/문장을 확인합니다.</Text>
          <Text style={{color:'black', marginBottom:'2vh', fontSize:'1.7vh'}}>3. 녹음 시작 - 중앙의 빨간색 버튼을 눌러주세요.</Text>
          <Text style={{color:'black', marginBottom:'1.5vh', fontSize:'1.7vh'}}>4. 녹음 끝 - 중앙의 빨간색 버튼을 다시 눌러주세요.</Text>
          <Text style={{color:'black', marginLeft:'2vh', marginBottom:'1.5vh', fontSize:'1.5vh'}}>* 목소리를 크게 내어 음량을 초록색으로 유지시키세요.</Text>
          <Text style={{color:'black', marginLeft:'2vh', marginBottom:'2vh', fontSize:'1.5vh'}}>* 끝까지 놔두면 제한시간에 따라 녹음이 종료됩니다.</Text>
          <Text style={{color:'black', marginBottom:'2vh',fontSize:'1.7vh'}}>5. 다음 녹음 - 밑에 생기는 다음 단계 버튼을 누릅니다</Text>
          <Text style={{color:'black', marginBottom:'2vh',fontSize:'1.7vh'}}>6. 이전 녹음 - 전에 녹음한 단어/문장을 재 녹음합니다.</Text>
          <Text style={{color:'black', marginBottom:'2vh', fontSize:'1.7vh'}}>7. 제출 - 녹음 단계가 모두 끝나면 제출을 누릅니다.</Text>
          
        </ColnumnDiv>
        <Text style={{color:'black', marginBottom:'2vh', fontSize:'1.3vh'}}>이 도움말은 우측 상단 물음표를 클릭하시면 다시 보실 수 있습니다.</Text>
        <SmallButton style={{fontSize:'2.5vh'}} onClick={handleCloseModal}>닫기</SmallButton>
      </Modal>
    )}
    { loadingModalOpen && (
      <Modal style ={{backgroundColor : 'white', width: '100%', height: '100%'}}>
        <span class="loader"></span>
      </Modal>
    )}
        <div onClick =  {handleGoBack} 
          style={{display: 'flex', flexDirection: 'row', alignItems: 'center', 
            justifyContents: 'center', position: 'absolute', left: 10, top:20}}>
          <img src="img/goBack.png" style={{width : 25, height:25}} />
          <div style={{color:'#84B583', fontSize: '2vh'}}>돌아가기</div>
        </div> 
        <div onClick = {handleOpenModal} 
          style={{display: 'flex', flexDirection: 'column', alignItems: 'center', 
            justifyContents: 'center', position: 'absolute', right: 20, top:10}}>
          <img src="img/help.png" style={{width : 25, height:20}} />
          <div style={{marginTop: 4, color: '#84B583'}}>도움말</div>
        </div> 
        <WordContainer>
            <Text style={{marginBottom:'2vh'}}>따라 읽어주세요!</Text>
            {windowWidth > 700 ?(
              <>
              <RowDivForWords>
                {word}
              </RowDivForWords>
              </>
            ) : (
              <>
                {word}
              </>
            )}
        </WordContainer>
      <LoadingContainer>
      {!recordingStatus && 
        <img src="img/recordGuideIcon.png" style={{width : '10vh', height:'10vh', zIndex:2, position: 'absolute',
          top : '50%', left:'50%'}} 
          onClick={handleRecordCountDown}/>
      }
        <OuterCircle style={{width:outerCircleDiameter, height:outerCircleDiameter}}>
          <InnerCircle style ={{width:innerCicleDiameter, height:innerCicleDiameter}} start={0} end={progress} />
          <SmallInnerCircle style ={{width: smallerDiamemter, height: smallerDiamemter, 
                top:innerCicleDiameter * 0.1, left : innerCicleDiameter * 0.1, 
              backgroundColor : recordButtonColor}}  onClick={handleRecordCountDown}>
            {!recordingStatus && fileName === '' && (
              <>
                  <Text style ={{color :'#FFFFFF', }}>녹음 시작</Text>
              </>
            )}
            {!recordingStatus && fileName !== '' && (
                <>
                    <Text style ={{color :'#FFFFFF'}} >다시 녹음 </Text>
                </>
            )}
            {recordingStatus && (
              <>
                  <Text style ={{color :'#FFFFFF' ,fontSize: '1.5vh'}} >따라 읽으세요!</Text>
              </>
            )}
          </SmallInnerCircle>
        </OuterCircle>
      </LoadingContainer>
      <ColumnDiv style={{position:'relative', top: '62vh'}}>
          {!recordingStatus && fileName !== '' && !endStatus && (
                <>
                    <SmallButton style={{marginTop : '3.5vh', width:'50vw'}} onClick={handleNextWord}>
                      <Text style={{fontSize: '30px', padding:'1vw', color:'#FFFFFF'}}>
                        다음 녹음 ▶
                      </Text>
                    </SmallButton>
                </>
            )}
            {!recordingStatus && fileName !== '' && endStatus && (
                <>
                    <SmallButton style={{marginTop : '3.5vh', width:'50vw'}} onClick={handleSubmit}>
                    <Text style={{fontSize: '30px', padding:'1vw', color:'#FFFFFF'}}>
                        제출
                      </Text>
                    </SmallButton>
                </>
            )}
            {((!recordingStatus && fileName !== '' && wordCount > 0) || (fileNameList[wordCount-1])) && (
              <>
                  <SmallButton style={{width:'40vw', backgroundColor :  '#CECECE'}} onClick={handlePrevWord}>
                    <Text style={{fontSize: '18px', padding:'1vw', color:'#FFFFFF'}}>
                      ◀ 이전 녹음
                    </Text>
                  </SmallButton>
              </>
          )}
      </ColumnDiv>
      <RecordingCheckDiv>
        <Text style={{color:'black', fontSize:'1.5vh', marginBottom:'0.5vh'}}>초록색을 최대한 유지시켜주세요!</Text>
        <RecordVolumeChecker style={{ width: diameter, height: diameter, backgroundColor : volumeColor, marginBottom:'2vh'}}/>
      </RecordingCheckDiv>
        <ReactMic
              visualSetting="false"
              record={isRecording}
              onStop={processRecordedAudio}
              mimeType="audio/webm"
              height='0'
              width='0'
          />
    </InitialBackground>
  )
}
export default RecordingScreen;