import React from 'react';
import styled from 'styled-components';

const StyledVIN = styled.div`
  border: 2px solid black;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
`

const Color = styled.div`
  width: 20px;
  background-color: blue;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Numbers = styled.div.attrs({
    className: 'pl-2 pr-2'
})`
  padding: 2px;
  font-size: 16px;
  text-transform:uppercase;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  letter-spacing: 2px;
  font-weight: 800;
  text-shadow: 1px 1px 0 #999999;
`

const NumberPlate = ({license}) => (
    <StyledVIN>
        <Color>
            <div style={{color: 'white', fontSize: '12px', fontWeight: 500}}>PL</div>
        </Color>
        <Numbers>
            {license}
        </Numbers>
    </StyledVIN>
)

export default NumberPlate;
