import { createGlobalStyle } from "styled-components";
import '../fonts.css'
const GlobalStyles = createGlobalStyle`
    body {
        font-family: 'KIMMFont';
        margin: 0;
        padding: 0;
    }
    
    input {
        font-family: 'KIMMFont';
    }
    
    input[type=password] {
        font-family: '굴림';
        &::placeholder{
            font-family : 'KIMMFont';
        }
        
    }
`;
export default GlobalStyles;