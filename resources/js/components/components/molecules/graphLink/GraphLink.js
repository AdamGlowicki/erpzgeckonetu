import React from 'react';
import styled from 'styled-components';
import CustomLink from "../../atoms/customLink/CustomLink";
import BubbleChartIcon from '@material-ui/icons/BubbleChart';

const StyledLink = styled(CustomLink)`
  position: fixed;
  top: 8%;
  left: 8%;
`

const StyledLinkContent = styled.div.attrs({
    className: 'p-2'
})`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: yellowgreen;
  color: white;
  font: 14px Roboto, sans-serif;
  border-radius: 4px;
  text-transform:uppercase;
  font-weight: bold;
`
const GraphLink = () => {
    return (
        <StyledLink to='/react/invest/graph'>
                <StyledLinkContent>
                    <BubbleChartIcon style={{color: 'white'}} className='mr-1' fontSize='small'/>
                    <div>
                        graf
                    </div>
                </StyledLinkContent>
        </StyledLink>
    );
};

export default GraphLink;
