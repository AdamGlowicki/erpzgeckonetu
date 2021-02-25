import React from 'react';
import styled, {keyframes} from 'styled-components';
import InfoIcon from '@material-ui/icons/Info';
import CustomLink from "../../../atoms/customLink/CustomLink";

const pulse = keyframes`
  from {transform: scale(.8)}
  to {transform: scale(1.2)}
`

const StyledWrapper = styled.div.attrs({
    className: 'p-2'
})`
  display: flex;
  flex-direction: row;
`

const AlertIcon = styled(InfoIcon)`
  color: red;
  animation: ${pulse} linear 500ms alternate infinite;
`

const LinkAlert = ({numberPlate}) => {
    return (
        <StyledWrapper>
            <AlertIcon/>
            <div className='ml-1'>
                <CustomLink to={`/react/carService/${numberPlate}`}>
                    <span style={{fontWeight: 600}}>
                        Tutaj
                    </span>
                </CustomLink>
            </div>
            <div className='ml-1'>
                oczekuje na weryfikację auto o numerach rejestracyjnych: {numberPlate}.
            </div>
        </StyledWrapper>
    );
};

export default LinkAlert;
