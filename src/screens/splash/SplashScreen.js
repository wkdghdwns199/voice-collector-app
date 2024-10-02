import {useEffect} from "react";
import InitialBackground from "../../components/styledComponent/InitialBackground";
import Text from "../../components/styledComponent/Text";
const SplashScreen = ({rootNavigateTo}) => {
    useEffect(() => {
        // 로그인이 되어있는 상태면 녹음화면, 아니면 로그인 화면으로 이동
        const redirectScreen = () => {
            window.localStorage.getItem('userId') ? rootNavigateTo('RecordScreen') : rootNavigateTo('LoginScreen');
        };
        // 1초 뒤에 자동으로 이동
        const timeoutId = setTimeout(redirectScreen, 1000);
        return () => clearTimeout(timeoutId);
    },[])   
    return (
        <InitialBackground>
            <img src="img/icon.png" style={{width : '20vh', height:'20vh', position:'relative', bottom: 150}} />
            <Text style={{fontSize: '5vh', marginBottom: 20}}>VDC</Text>
            <Text>Voice Data Collector</Text>
        </InitialBackground>
    )
}
export default SplashScreen;