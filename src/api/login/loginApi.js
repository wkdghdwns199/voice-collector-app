// 로그인 관련 처리 라이브러리
// supabase 연동 client
import { supabase } from "../supabase";
export const loginSubmit = async (idInput, pwInput, rootNavigateTo) => {
    // 로그인이 잘 되었으면 로그인 로그 supabase에 처리하고 녹음 화면으로 이동
    const checkAndRedirect = async () => {
        // supabase 에 현재 로그인 계정을 로그인 기록 현황 올림
        const {error} = await supabase
            .from('login_status')
            .insert({logged_email : idInput, is_logged: true})
        // 로컬 스토리지에 현재 로그인 아이디 저장
        window.localStorage.setItem('userId', idInput)
        // 녹음 화면으로 이동
        rootNavigateTo('RecordScreen')        
    }
    // 중복 로그인 처리
    const handleDuplicatedLogin = async () => {
        // 로컬 스토리지 초기화
        window.localStorage.clear()
        // supabase 에서 로그인 session 제거
        await supabase.auth.signOut()
        // 화면에 알림 띄우기
        alert('이미 다른 PC 에서 로그인이 되어 있습니다. 로그아웃을 하시거나 관리자에게 문의해주세요!')
    }
    // 증복 로그인인지 확인 후 로그인 처리
    const handleRedirect = async () => {
        // supabase 에서 로그인하려는 계정 중복 로그인 확인
        const {data, error} = await supabase
            .from('login_status')
            .select('is_logged')
            .eq('logged_email', 'test@test.com')   
        if (error) return ;
        // 중복 로그인이면 중복 로그인 처리, 아니면 정상 로그인 처리
        data.length ? handleDuplicatedLogin()            
            : checkAndRedirect()
        }
    // supabase 에 보낼 로그인 정보
    const formData = {
        'email': idInput,
        'password': pwInput,
    }
    // supabase 로그인 정보 입력
    const {data, error} = await supabase.auth.signInWithPassword(formData)
    // 로그인 정보가 안 맞으면 에러, 아니면 중복 로그인 확인으로 이동
    error ? alert('로그인 에러입니다. 입력된 정보를 확인해주세요') : handleRedirect()
}