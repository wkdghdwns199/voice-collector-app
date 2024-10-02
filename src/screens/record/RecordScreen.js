import {useState, useEffect} from 'react';
import { CSSTransition } from 'react-transition-group';
import {supabase} from '../../api/supabase';
import RecordInfoScreen from './RecordInfoScreen';
import RecordingScreen from './RecordingScreen';
import '../../css/RecordScreen.css';
const RecordScreen = ({rootNavigateTo}) => {
    const [recordCurrentPage, setRecordCurrentPage] = useState('RecordInfoScreen');
    const [wordData, setWordData] = useState([])
    //  현재 녹음 관련 페이지에서 어떤 페이지인지 이동하는 함수
    const recordNavigateTo = (page) => {
      setRecordCurrentPage(page);
    }
    // supabase에서 단어 리스르 가져오기
    const getData = async () => {
        const {data, error} = await supabase
            .from('recording_terms')
            .select('*')
        if (error) alert('단어 데이터를 가져올 수 없습니다. 관리자에게 문의해주세요!')
        // 단어 리스트를 가져와서 supabase에서 설정한 단어 순서대로 정렬하기
        let dataCopy = [...data]
        dataCopy.sort((prev, next) => {
            return prev.order_number - next.order_number
        })
        setWordData(dataCopy)
    }
    // 시작할 때 단어 리스트 가져오기
    useEffect(() => {
        getData()
    },[])
    return (
        <div className='record-container'>
            <CSSTransition
                in={recordCurrentPage === 'RecordInfoScreen'}
                timeout={300} // 애니메이션 지속 시간 (밀리초)
                classNames="page"
                unmountOnExit
            >
                <RecordInfoScreen rootNavigateTo={rootNavigateTo} 
                    recordNavigateTo={recordNavigateTo}/>
            </CSSTransition>

            <CSSTransition
                in={recordCurrentPage === 'RecordingScreen'}
                timeout={300}
                classNames="page"
                unmountOnExit
            >
                <RecordingScreen rootNavigateTo={rootNavigateTo} 
                    recordNavigateTo={recordNavigateTo} wordData={wordData}/>
            </CSSTransition>
        </div>
    )
}
export default RecordScreen

