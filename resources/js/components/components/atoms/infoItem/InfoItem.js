import React from "react";
import styled from "styled-components";

const StyledTitleInfoItem = styled.div`
  font-weight: 700;
  margin-left: ${props => props.onlyIcon ? 0 : '8px'};
`
const InfoItem = ({title, value, icon, onlyIcon}) => (
    <div className='d-flex flex-row align-content-center'>
        <div className='mr-1'>{icon}</div>
        <div style={{fontWeight: 'normal'}}>{title}</div>
        <StyledTitleInfoItem onlyIcon={onlyIcon}>
            {value}
        </StyledTitleInfoItem>
    </div>
)

export default InfoItem
