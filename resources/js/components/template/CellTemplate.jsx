import React from 'react';
import styled, {css, keyframes} from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import {displayPopover} from '../common/globalMethods';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {Breakpoints} from "../enums/sizing/breakpionts";


const extension = keyframes`
  0% {transform: scaleX(0); opacity: 0}
  100% {transform: scaleX(1); opacity: 1}
`

const StyledCell = styled.div.attrs({
    className: 'd-flex flex-column justify-content-center rounded ml-1'
})`
  border: 1px solid darkgrey;
  font-size: 12px;
  width: 100px;
  font-weight: bolder;
  overflow: hidden;
  transition: .5s ;
  transition-delay: .7s;
  animation: ${extension} 1s ease;
  background-color: ${({color}) => color};
  ${({main, mainColor}) => (
    main && css`
      min-width: 184px;
      background-color: rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]});
      border: none;
      margin-right: 4px;
      height: ${props => props.focused ? 124 : 59}px;
      transition: .5s ;
      transition-delay: .1s;
    `
  )}
  ${({moreInfo}) => (
      moreInfo && css`
      height: 248px;
      width: 200px;
  `
    )}
  ${({matches}) => (
      matches && css`
        min-width: 160px;
        height: 72px;
        font-size: 20px;
      `
  )}
`;

const CellTemplate = ({children, popoverMessage, mainColor = [162,198,0], ...props}) => {
    const matches = useMediaQuery(`(max-width:${Breakpoints.MD})`);
    return (
        <React.Fragment>
            {displayPopover(popoverMessage ? popoverMessage : '') ? (
                <Tooltip title={popoverMessage} placement="top">
                    <StyledCell mainColor={mainColor} {...props} matches={matches}>
                        {children}
                    </StyledCell>
                </Tooltip>
            ) : (
                <StyledCell mainColor={mainColor} {...props} matches={matches}>
                    {children}
                </StyledCell>
            )}
        </React.Fragment>
    )
};

export default CellTemplate;
