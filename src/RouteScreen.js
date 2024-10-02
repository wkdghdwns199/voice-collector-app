import {useState} from 'react';
import { CSSTransition } from 'react-transition-group';
import LoginScreen from './screens/login/LoginScreen';
import RecordScreen from './screens/record/RecordScreen';
import SplashScreen from './screens/splash/SplashScreen';
import './css/RouteScreen.css';
const RouteScreen = () => {
    const [currentPage, setCurrentPage] = useState('SpalshScreen');
    // 현재 보여주는 화면을 바꿔주는 함수
    const rootNavigateTo = (page) => {
        setCurrentPage(page);
    }
    return (
        <div className='route-container'>

            <CSSTransition
                in={currentPage === 'SpalshScreen'}
                timeout={300} // 애니메이션 지속 시간 (밀리초)
                classNames="page"
                unmountOnExit
            >
                <SplashScreen rootNavigateTo={rootNavigateTo} />
            </CSSTransition>

            <CSSTransition
                in={currentPage === 'LoginScreen'}
                timeout={300} // 애니메이션 지속 시간 (밀리초)
                classNames="page"
                unmountOnExit
            >
                <LoginScreen rootNavigateTo={rootNavigateTo} />
            </CSSTransition>

            <CSSTransition
                in={currentPage === 'RecordScreen'}
                timeout={300}
                classNames="page"
                unmountOnExit
            >
                <RecordScreen rootNavigateTo={rootNavigateTo} />
            </CSSTransition>
        </div>
    )
}
export default RouteScreen

