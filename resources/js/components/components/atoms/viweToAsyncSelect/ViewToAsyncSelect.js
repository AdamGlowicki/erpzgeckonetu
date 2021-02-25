import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.section`
  width: 300px;
  display: flex;
  flex-direction: column;
  font-size: 1em;
  font-weight: bold;
`

const StyledName = styled.div`
  color: lightgray;
  font-weight: lighter;
`

const ViewToAsyncSelect = ({data}) => {
    return (
        <StyledWrapper>
            <div className='d-flex flex-row'>
                <div className='mr-1'>{data.id}</div>
                <div>{data.model_name}</div>
                <div className='ml-auto'><img src={data.photo}/></div>
            </div>
           <StyledName>{data.items_manufacturer.name}</StyledName>
        </StyledWrapper>
    );
};

export default ViewToAsyncSelect;
