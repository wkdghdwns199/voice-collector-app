import styled from 'styled-components';
const InnerCircle = styled.div`
  width: 137.5px;
  height: 137.5px;
  border-radius: 50%;
  background: conic-gradient(
    from ${(props) => props.start}deg,
    #fff ${(props) => props.start}deg,
    #fff ${(props) => props.end}deg,
    #A3CCA2 ${(props) => props.end}deg,
    #A3CCA2 360deg
  );
`;
export default InnerCircle;