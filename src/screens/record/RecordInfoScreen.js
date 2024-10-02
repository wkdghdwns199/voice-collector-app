import React, { useState, useEffect } from 'react';
import InitialBackground from '../../components/styledComponent/InitialBackground';
import TextBox from '../../components/styledComponent/TextBox';
import Button from '../../components/styledComponent/Button';
import RowDiv from '../../components/styledComponent/RowDiv';
import RadioBox from '../../components/styledComponent/RadioBox';
import Text from '../../components/styledComponent/Text';
import Title from '../../components/styledComponent/Title';
import SmallButton from '../../components/styledComponent/SmallButton';
import {recordInfo} from '../../api/record/recordInfo';
import ColnumnDiv from '../../components/styledComponent/ColumnDiv';
import Modal from '../../components/styledComponent/Modal';
import { supabase } from '../../api/supabase';
function RecordInfoScreen({rootNavigateTo, recordNavigateTo}) {
  const [idInput, setIdInput] = useState('');
  const [nameInput, setNameInput] = useState('')
  const [birthInput, setBirthInput] = useState('')
  const [gender, setGender] = useState('');
  const [modalOpen, setModalOpen] = useState(false)
  // 스크롤 맨 위로 초기화
  useEffect(() => {
    window.scrollTo(0,0)
  },[])
  // 환자 ID 텍스트 state 변경 함수
  const handleIdChange = (event) => {
    setIdInput(event.target.value)
  }
  // 환자 이름 텍스트 state 변경 함수
  const handleNameChange = (event) => {
    setNameInput(event.target.value);
  }
  // 환자 생년월일 텍스트 state 변경 함수
  const handleBirthChange = (event) => {
      setBirthInput(event.target.value);
  }
  // 환자 성별 선택 state 변경 함수
  const handleGenderChange = (event) => {
      setGender(event.target.value);
    };

  // 이름 blur 처리 변경 함수
  const hideName = (length) => {
      let hiddenName = '';
      for (let i=1; i<length; i++){
          hiddenName += '*';
      }
      return hiddenName
  }
  // 환자 정보 등록 후 녹음 화면으로 이동하는 함수
  const handleNavigateToRecord = () => {
    // 의사 아이디 로컬 스토리지에 저장
    const doctorId = window.localStorage.getItem('userId');
    // 환자 이름 블러 처리
    const nameBlur = nameInput[0] + hideName(nameInput.length);
    recordInfo(doctorId, idInput, nameBlur, gender, birthInput, recordNavigateTo)
  }
  // 로그아웃 처리 함수
  const handleLogout = async () => {
    // supabase 세션 삭세
    supabase.auth.signOut()
    // 로그인 기록 supabase 에서 삭제
    const {error} = await supabase
      .from('login_status')
      .delete()
      .eq('logged_email', window.localStorage.getItem('userId'))
    // 로그아웃 에러가 나면 오류 메세지 띄우기, 아니면 정상 로그아웃 메세지 띄우기
    error ? alert('서버의 오류가 있어서 로그아웃이 정상적으로 이루어지지 않았습니다. 관리자에게 문의 바랍니다.') : alert('정상적으로 로그아웃되었습니다!')
    //로컬 스토리지 초기화
    window.localStorage.clear()
    // 로그인 화면으로 이동
    rootNavigateTo('LoginScreen');
  }
  // 도움말 Modal 띄우기
  const handleOpenModal = () => {
    // Modal 띄워져 있으면 닫기
   if (modalOpen) {
    setModalOpen(false)}
    // 아니면 Modal 띄우기
    else {
      setModalOpen(true)    
    }
  }
  // Modal 닫기
  const handleCloseModal = () => {
    setModalOpen(false)
  }
  return (
    <InitialBackground>
      { (modalOpen) && (
      <>
      <Modal>
        <Text style={{color:'black',fontSize: '3vh', marginBottom:'3vh'}}>"녹음 정보 입력" 도움말</Text>
        <ColnumnDiv style ={{alignItems:'flex-start'}}>
          <Text style={{color:'black',  marginBottom: '2vh'}}>1. 녹음하기 전 환자 분의 정보를 입력하는 단계입니다.</Text>
          <Text style={{color:'black', marginBottom:'1.5vh'}}>2. 녹음 데이터로 다음과 같이 제출되고 저장됩니다.</Text>
          <Text style={{color:'black', marginLeft:'0.5vh', marginBottom:'1vh' , fontSize:'1.5vh'}}>* 환자 고유 일련코드</Text>
          <Text style={{color:'black', marginLeft:'0.5vh', marginBottom:'1vh', fontSize:'1.5vh' }}>* 환자 생년월일</Text>
          <Text style={{color:'black', marginLeft:'0.5vh', marginBottom:'1vh', fontSize:'1.5vh' }}>* 환자 성별</Text>
          <Text style={{color:'black', marginLeft:'0.5vh', marginBottom:'2vh', fontSize:'1.5vh'}}>* 녹음 날짜, 시간</Text>
        </ColnumnDiv>
        <Text style={{color:'black', marginBottom:'2vh', fontSize:'1.3vh'}}>이 도움말은 우측 상단 물음표를 클릭하시면 다시 보실 수 있습니다.</Text>
        <SmallButton style={{fontSize:'2.5vh'}} onClick={handleCloseModal}>닫기</SmallButton>
      </Modal>
      </>
      )}
       <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContents: 'center', position: 'absolute', right: 20, top:10}}
        onClick={handleOpenModal}>
          <img src="img/help.png" style={{width : 25, height:20}} />
          <div style={{marginTop: 4, color: '#84B583'}}>도움말</div>
        </div> 
      <Title>Recording Info</Title>
      <ColnumnDiv>
      <TextBox type="text" id="idInput" placeholder="Patient ID (ex. 000001)" 
                  value={idInput} onChange={handleIdChange}/>
      <TextBox type="text" id="pwInput" placeholder="Patient Name (ex. 홍길동)" 
              value={nameInput} onChange={handleNameChange}/>
      <TextBox type="text" maxLength={6} id="birthInput" placeholder="YYMMDD (ex. 990427)" 
              value={birthInput} onChange={handleBirthChange}/>
      <RowDiv>
        <RowDiv>
            <RadioBox type="radio" name="maleCheck" value="M" 
                checked={gender === 'M'} onChange={handleGenderChange}/>
            <Text style={{color : '#84B583'}}>Male</Text>
        </RowDiv>
        <RowDiv>
            <RadioBox type="radio" name="femaleCheck" style={{borderColor:'red'}} value="F" 
                checked={gender === 'F'} onChange={handleGenderChange}/>
            <Text style={{color : '#84B583'}}>Female</Text> 
        </RowDiv>
      </RowDiv>
      </ColnumnDiv>
      <ColnumnDiv>
        <Button style={{backgroundColor :'#FF6161', marginLeft: 20}} onClick={handleNavigateToRecord}>
          <Text style={{fontSize: '25px',padding:'1vw', color:'#FFFFFF'}}>Recording Start</Text>
        </Button>
        <Button onClick={handleLogout} style={{backgroundColor : '#CECECE'}}>
          <Text style={{fontSize: '15px', padding:'1vw', color:'#FFFFFF'}}>Logout</Text>
        </Button>
      </ColnumnDiv>
    </InitialBackground>
  )
}
export default RecordInfoScreen;
