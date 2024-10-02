// 녹음 제출 관련 라이브러리

// supabase client 연동
import {supabase} from '../../api/supabase';
export const recordSubmit = async (fileNameList, hexStringList, doctorId, patientId, recordNavigateTo, setLoadingModalOpen) => {
  // 로딩창 띄우기
  setLoadingModalOpen(true)
    var index = 0
    // 녹음본 제출 확인 알림 띄우기 
    if (window.confirm('녹음본들을 제출하시겠습니까?')){
      // 녹음본 이름 리스트 길이만큼 순회하면저 제출
      for (index=0; index<fileNameList.length; index++){
        // supabase storage에 저장 
        const { data, error } = await supabase.storage.from('wavFiles')
          .upload(`${doctorId}/${patientId}/${fileNameList[index]}`, hexStringList[index]);

        // 에러라면 실패 메세지 알람 띄우기
        if (error) {
          alert('녹음본 제출에 실패하였습니다. 다시 시도해 주십시오. (' + (index) + '/' + fileNameList.length + ' 성공)' )
          break
        } 
      }
      // 제출이 완료되었다면 완료 알람 띄우기
      if (index === fileNameList.length){
        alert('제출을 완료하였습니다.');
        recordNavigateTo('RecordInfoScreen')
        // 세션 스토리지 초기화
        window.sessionStorage.clear();  
      }
    }
    // 제출을 취소하면 제출 취소 알람 띄우기
    else {
      alert('제출을 취소하였습니다.')
      return; 
    }
}