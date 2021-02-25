import React, {Fragment, useEffect, useRef, useState} from 'react';
import styled, {css, keyframes} from 'styled-components';
import InputText from "../atoms/inputText/InputText";
import MenuItem from "@material-ui/core/MenuItem";
import SideBar from "../molecules/sideBar/SideBar";
import MenuIcon from '@material-ui/icons/Menu';
import {useFocusRef} from "../../hooks/useFocusRef";
import {useSelector} from "react-redux";
import {withStyles} from "@material-ui/core";

const slide = keyframes`
  from {transform: scaleX(0); opacity: 0}
  to {transform: scaleX(1); opacity: 1}
`

const slideOut = keyframes`
  from {transform: scaleX(1); opacity: 1}
  to {transform: scaleX(0); opacity: 0}
`

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: whitesmoke;
  width: 100%;
  min-height: 100vh;
`

const StyledHeader = styled.div.attrs({
    className: 'mr-2 mt-2'
})`
   align-self: flex-end;
   display: flex;
   flex-direction: row;
   justify-content: flex-end;
`

const StyledNav = styled.div`
  position: fixed;
  top: 12px;
  left: 4px;
  z-index: 9999;
`

const StyledContent = styled.div`
  margin-top: 24px;
  align-self: center;
  max-width: 95%;
`

const StyledHamburger = styled.div.attrs({
    className: 'ml-3 mt-3'
})`
  grid-row: 1 / 2;
  grid-column: 1 / 2;
`

const StyledMenuContent = styled.div.attrs({
    className: 'mt-1 mb-1'
})`
  display: flex;
  flex-direction: row;
  justify-content: center;
  color: #9A9A9A;
  font: 12px Poppins, sans-serif;
  ${({bold}) => (
    bold && css`
        font-weight: bold;
     `
)}

`

const StyledMenuItem = withStyles({
    root: {
        '&.MuiListItem-root.Mui-selected': {
            backgroundColor: 'white',
        },
    },
})(MenuItem)

const AnimateNav = styled.div`
  animation: ${slide} .5s;
  transform-origin: left;
  ${({close}) => (
    close && css`
          animation: ${slideOut} 200ms;
      `
)}
`

const StyledA = styled.a.attrs({
    className: 'p-2'
})`
  text-transform: none;
  text-decoration: none;
  color: yellowgreen;
   &:focus, &:hover, &:visited, &:link, &:active {
     text-decoration: none;
   }
   &:hover {
   background-color: whitesmoke;
   }
  display: flex;
  flex-direction: row;
  align-items: center;
  font: 12px Poppins, sans-serif;
  width: 100%;
`

const MainTheme = ({children}) => {
    const [user, setUser] = useState({data: ''})
    const [visible, setVisible] = useState(false);
    const [close, setClose] = useState(false);
    const ref = useRef()
    const focus = useFocusRef(ref);

    const userSelector = useSelector(state => state.user.user)

    useEffect(() => {
        if (!visible) {
            setVisible(focus)
        }
        if (visible) {
            setClose(true)
        }

    }, [focus])

    useEffect(() => {
        if (userSelector) {
            setUser(userSelector)
        }
    }, [userSelector])

    const onAnimationEnd = () => {
        if (close) {
            setVisible(focus)
            setClose(false)
        }
    }
    return (
        <Fragment>
            <StyledWrapper>
                <StyledHeader>
                    <InputText
                        select
                        InputProps={{ disableUnderline: true }}
                    >
                        <StyledMenuItem>
                            <div className='d-flex flex-column align-items-start'>
                                <StyledMenuContent>Zalogowany jako: </StyledMenuContent>
                                <StyledMenuContent bold>{user.data}</StyledMenuContent>
                            </div>
                        </StyledMenuItem>
                        <StyledMenuItem>
                            <StyledA href='/manage'><StyledMenuContent>Zarządzanie</StyledMenuContent></StyledA>
                        </StyledMenuItem>
                        <StyledMenuItem>
                            <StyledA href='/profile'><StyledMenuContent>Profil</StyledMenuContent></StyledA>
                        </StyledMenuItem>
                        <StyledMenuItem>
                            <StyledA href='/profile'><StyledMenuContent>Ustawienia</StyledMenuContent></StyledA>
                        </StyledMenuItem>
                        <StyledMenuItem>
                            <StyledA href='/login'><StyledMenuContent>Wyloguj</StyledMenuContent></StyledA>
                        </StyledMenuItem>
                    </InputText>

                </StyledHeader>

                <StyledContent>
                    {children}
                </StyledContent>
            </StyledWrapper>

            <StyledNav>
                <div ref={ref}>
                    <StyledHamburger>
                        <MenuIcon/>
                    </StyledHamburger>

                    {visible ? (
                        <AnimateNav close={close} onAnimationEnd={onAnimationEnd}>
                            <SideBar/>
                        </AnimateNav>
                    ) : null}
                </div>
            </StyledNav>
        </Fragment>

    );
};

export default MainTheme;
