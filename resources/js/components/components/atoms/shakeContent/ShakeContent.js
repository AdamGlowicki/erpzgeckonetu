import React, {useEffect, useState} from 'react';
import styled, {css, keyframes} from "styled-components";

const shake = keyframes`
  0% {transform: translateX(0);}
  10% {transform: translateX(-10px);}
  20% {transform: translateX(10px);}
  30% {transform: translateX(-10px);}
  40% {transform: translateX(10px);}
  50% {transform: translateX(-10px);}
  60% {transform: translateX(10px);}
  70% {transform: translateX(-10px);}
  80% {transform: translateX(10px);}
  90% {transform: translateX(-10px);}
  100% {transform: translateX(0);}
`

const StyledShakeButton = styled.div`
  ${({error}) => (
    error && css`
          animation: ${shake} .5s linear;
      `
)}
`

const ShakeContent = ({shake, children}) => {

    const [stateShake, setShake] = useState(null);

    useEffect(() => {
        setShake(shake)
        const handler = setTimeout(() => setShake(false), 500)

        return () => {
            clearTimeout(handler)
        }
    }, [shake])

    return (
        <StyledShakeButton error={stateShake}>
            {children}
        </StyledShakeButton>
    );
};

export default ShakeContent;
