// 녹음을 위한 글자 가져오는 라이브러리

// supabase 연동 client
import { supabase } from "../supabase"
// supabase 에 저장되어 있는 글자들 가져오는 함수
export const getWords = async () => {
    // supabase 에서 글자 가져오기
    const {data, error} = await supabase
    .from('recording_terms')
    .select('*')
    // 글자 정렬
    data.sort(data.order_number)
    // 정렬된 글자 return 
    return data
}