import React from 'react';
import styled, {keyframes} from 'styled-components';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import DisplayAlerts from "../displayAlerts/DisplayAlerts";

const alertAnimation = keyframes`
 0%, 30% {color: black; transform: rotateY(0) scale(1)}
 70%, 100% {color: red; transform: rotateY(360deg) scale(1.3)}
`

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  box-shadow: 7px 6px 16px -5px rgba(0,0,0,0.58);
  border: 2px solid whitesmoke;
  display: flex;
  flex-direction: column;
`

const AlertIcon = styled(AnnouncementIcon).attrs({
    className: 'mr-2'
})`
  animation: ${alertAnimation} 3s infinite alternate;
`

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
`

const Alert = ({alerts}) => {
    return (
        <StyledWrapper>
            <div className='d-flex flex-row pt-2 pl-2'>
                <AlertIcon/>
                <Title>Aktywne alerty</Title>
            </div>
            <div className='mt-2'>
                <DisplayAlerts alerts={alerts}/>
            </div>
        </StyledWrapper>
    );
};

export default Alert;
