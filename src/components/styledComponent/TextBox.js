import styled from 'styled-components';
const TextBox = styled.input`
    padding: 2vh;
    font-size: 2vh;
    border : 0px;
    border-radius: 20px;
    margin : 1vh;
    width : 33vh;
    border : 1px solid;
    background-color : #FFFFFF;
    color : #84B583;
    
    &::placeholder{
        color: #A3CCA2;
    }
`;
export default TextBox;