import { useState } from 'react';
import InitialBackground from "../../components/styledComponent/InitialBackground";
import Title from "../../components/styledComponent/Title";
import TextBox from "../../components/styledComponent/TextBox";
import Button from "../../components/styledComponent/Button";
import Text from '../../components/styledComponent/Text';
import { loginSubmit } from '../../api/login/loginApi';
import ColnumnDiv from '../../components/styledComponent/ColumnDiv';
const LoginScreen = ({rootNavigateTo}) => {
    const [idInput, setIdInput] = useState(''); 
    const [pwInput, setPwInput] = useState('');
    // 아이디 텍스트 state 변경
    const handleIdChange = (event) => {
        setIdInput(event.target.value)
    }
    // 비밀번호 텍스트 state 변경
    const handlePwChange = (event) => {
        setPwInput(event.target.value)
    }
    // 로그인 실행 함수
    const handleLogin = () => {
        loginSubmit(idInput, pwInput, rootNavigateTo)
    }
    return (
        <InitialBackground>
            <Title>Login</Title>
            <ColnumnDiv style={{margin : 10}}>
                <Text style={{fontSize : '1.8vh', marginBottom: 10}}>음성 분석을 위한 데이터를 수집하는 어플리케이션입니다!</Text>
                <Text style={{wordWrap:'break-word', whiteSpace:'pre-line', fontSize : '1.8vh'}}>로그인 후 이용하실 수 있습니다.</Text>
            </ColnumnDiv>
            <TextBox type="text" id="idInput" placeholder="ID" 
                        value={idInput} onChange={handleIdChange}/>
            <TextBox type="password" id="pwInput" placeholder="Password" 
                    value={pwInput} onChange={handlePwChange}/>
            <Button onClick={handleLogin}>
                <Text style={{fontSize: '25px', padding:'1vw', color:'#FFFFFF'}}>Login</Text>
            </Button>
        </InitialBackground>
    )
}
export default LoginScreen;