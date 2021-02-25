import React, {Fragment, useEffect, useState} from 'react';
import styled, {keyframes} from 'styled-components';
import GraphControls from "../graphControls/GraphControls";
import {postData} from "../../../../common/apiMethods/apiMethods";
import {useCookies} from "react-cookie";
import {useDispatch} from "react-redux";
import {fetchGraphTemplate} from "../../../../reducers/graph/duck/operations";

const slide = keyframes`
  from {transform: scaleX(0) translate(-50%, -50%);}
  to {opacity: 1; transform: scaleX(1) translate(-50%, -50%);}
`
const slideOut = keyframes`
  from {transform: scaleX(1) translate(-50%, -50%);}
  to {opacity: 0; transform: scaleX(0) translate(-50%, -50%);}
`

const StyledWrapper = styled.div`
  width: 30%;
  min-height: 70%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 0 40px 20px rgba(0,0,0,0.4);
  padding: 4px;
  border-radius: 8px;

  animation: ${props => props.animation ? slide : slideOut} .5s;
  transform-origin:${props => props.animation ? 'right' : 'right'};
`

const StyledElement = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  transform: ${props => `rotate(${props.rotate}deg)`};
  background-color: ${props => props.backgroundColor};
  border-radius: ${props => props.radius}%;
  border: ${props => `${props.borderSize}px ${props.borderType} ${props.borderColor}`};
  font-size: ${props => props.fontSize}px;
  font-weight: ${props => props.fontWeight};
  color: ${props => props.color};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const StyledContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
`

const StyledButtons = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
`

const StyledButton = styled.button.attrs(props => ({
    className: props.space ? 'ml-1' : null
}))`
  width: 120px;
  height: 30px;
  border: none;
  border-radius: 8px;
  background-color: ${props => props.second ? '#EB3F17' : 'yellowgreen'};
  &:focus {
    outline: none;
  }
  &:active {
    opacity: .75;
  }
`

const initialStyle = {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    radius: '4',
    borderSize: 1,
    borderType: 'solid',
    borderColor: '#000',
    fontSize: 16,
    fontWeight: 400,
    color: '#000',
    rotate: 0,
}
const AddNewElementWindow = ({open: propsOpen, setOpen: propsSetOpen}) => {
    const [style, setStyle] = useState({...initialStyle});
    const [open, setOpen] = useState(false)

    const [cookies,] = useCookies();

    const dispatch = useDispatch();

    useEffect(() => {
        if (propsOpen) setOpen(true)
    }, [propsOpen])

    const onAnimationEnd = () => {
        if (!propsOpen) setOpen(false)
    }

    const handleStyle = (e) => {
        const {value, name} = e.target;
        setStyle({
            ...style,
            [name]: value,
        })
    }

    const handleSave = async() => {
        try {
            await postData('/singleElements/create', {...style}, cookies);
            dispatch(fetchGraphTemplate(cookies));
            propsSetOpen(false);
        } catch (e) {

        }
    }

    return (
        <Fragment>
            {open ? (
                <StyledWrapper
                    onAnimationEnd={onAnimationEnd}
                    animation={propsOpen}
                >
                    <StyledContent>
                        <div className='flex-grow-1 d-flex flex-row justify-content-center align-items-center'>
                            <StyledElement
                                {...style}
                            >
                                Zawartość
                            </StyledElement>
                        </div>

                        <div>
                            <GraphControls
                                style={style}
                                elementId={1}
                                handleStyle={handleStyle}
                                add
                            />
                        </div>
                    </StyledContent>

                    <StyledButtons>
                        <StyledButton
                            onClick={handleSave}
                        >
                            Zapisz
                        </StyledButton>

                        <StyledButton
                            second
                            space
                            onClick={() => propsSetOpen(false)}
                        >
                            Anuluj
                        </StyledButton>
                    </StyledButtons>
                </StyledWrapper>
            ) : null}
        </Fragment>

    );
};

export default AddNewElementWindow;
