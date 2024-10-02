// 환자 정보 입력 관련 확인 라이브러리
export const recordInfo = (doctorId, idInput, nameBlur, gender, birthInput, recordNavigateTo) => {
    // 환자 나이 계산 
    const calculateAge = (birth) => {
      // 현재 년도를 가져와서 사용자가 입력한 환자 생년월일 중 년도를 2000과 더한다.
      const date = new Date()
      const currentYear = date.getFullYear();
      const year = birth.substring(0,2);
      // 만약 환자 생년 + 2000 이 현재 년도보다 크면, 100을 빼서 현재 년도 - (환자 생년 + 2000 - 100) 로 나이 계산
      var intYear = 2000 + parseInt(year);
      if (intYear > currentYear) intYear = intYear - 100;
      // 아니면 현재 년도 - (환자 생년 + 2000)로 나이 계산
      return currentYear - intYear; 
    }
    // 현재 입력된 월, 일이 알맞은지 확인
    const checkMonthAndDate = (birth) => {
      // 입력된 환자 생년 계산
      const date = new Date()
      const currentYear = date.getFullYear();
      const year = birth.substring(0,2);
      var birthYear = 2000 + parseInt(year);
      if (birthYear > currentYear) birthYear = birthYear - 100;
      // 31일 포함, 미포함 달들 분류
      const monthWith31 = [1,3,5,7,8,10,12]
      const monthWithout31 = [4,6,9,11]
      // 만약 생년월일 길이가 6이 아니면 return false
      if (birth.length != 6) return false 
      // 환자 생월, 생일 추출
      const month = parseInt(birth.substring(2,4))
      const day = parseInt(birth.substring(4,6))
      // 만약 환자 생월이 1-12 월이 아니면 return false
      if (1 > month || month > 12 ) return false
      // 만약 환자 생월이 31 포함 월일 때
      if (monthWith31.includes(month)) {
        // 환자 생일이 1-31 이 아니면 return false
        if (0>=day || day > 31) return false
      }
      // 만약 환자 생월이 31 미호팜 월일 때
      else if (monthWithout31.includes(month)) {
        // 환자 생일이 1-30 이 아니면 return false
        if (0>=day || day > 30) return false
      }
      // 만약 환자 생월이 2월일 때
      else if (month == 2){
        // 환자 생년이 윤년일 때
        if (birthYear % 4 == 0 && birthYear % 100 !=0) {
          // 환자 생일이 1-29이 아닐 때 return false
          if (0>=day || day > 29) return false
        }
        // 환자 생년이 윤년이 아닐 때
        else {
          // 환자 생일이 1-28이 아닐 때 return false
          if (0>=day || day > 28) return false
        }
      }
      // 조건이 다 부합하면 return true
      return true
    }
    // 환자 생년월일 체크하기
    const checkBirthString = (birth) => {
      // 숫자로만 이루어져 있고 생년월일 형식이 다 괜찮으면 true, 아니면 false return
      return birth.match(/^[0-9]+$/) && checkMonthAndDate(birth);
    }
    // 환자 정보 내용이 다 입력되면 녹음 화면으로 이동함
    const handleRedirect = () => {
      // session storage 지정
      const session = window.sessionStorage;
      // 이름, 생년월일, 성별, 환자 아이디, 의사 아이디가 전부 빈 내용일 때
      if (nameBlur !== '' && birthInput!== '' && gender !=='' && doctorId !=='' && idInput !==''){
        // 만약 생년월일이 올바르다면 세션이 저장 후 녹음 화면으로 이동
        if (checkBirthString(birthInput)){
          session.setItem('name', nameBlur);
          session.setItem('age', calculateAge(birthInput));
          session.setItem('gender', gender);
          session.setItem('doctorId', doctorId);
          session.setItem('patientId', idInput);
          recordNavigateTo('RecordingScreen')
        }
        // 아니면 화면에 알림 띄우기
        else {
          alert('생년월일이 제대로 입력되지 않았습니다. 형식에 맞게 입력해주세요.')
          return ;
        }
    }
    // 빈 내용이라면 화면에 알림 띄우기
    else {
      alert('환자 정보가 정확하지 않습니다. 입력된 정보를 확인해주세요.')
      return ;
    } 
      // 세션에 환자 블러 처리 이름 저장
      window.sessionStorage.setItem('name', nameBlur)
    }
    // 내용 확인 후 화면 이동 
    handleRedirect()
  }