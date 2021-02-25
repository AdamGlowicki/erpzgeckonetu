import React, {Fragment, useEffect, useRef, useState} from 'react';
import styled, {keyframes} from 'styled-components';
import {useCookies} from "react-cookie";
import {useDispatch, useSelector} from "react-redux";
import {addElement} from "../../../../reducers/graph/duck/actions";
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import AddNewElementWindow from "../addNewElementWindow/AddNewElementWindow";
import AcceptWindow from "../../../molecules/acceptWindow/AcceptWindow";
import {turnOnAlert} from "../../../../reducers/alert/duck/actions";
import {IS_ERROR} from "../../../../reducers/investments/duck/reduxType";
import {deleteData, postData} from "../../../../common/apiMethods/apiMethods";
import {fetchGraph, fetchGraphTemplate} from "../../../../reducers/graph/duck/operations";
import {useParams} from "react-router";

const slide = (width) => keyframes`
  from {transform: translateX(${width}px);}
  to {transform: translateX(0);}
`
const slideOut = (width) => keyframes`
  from {transform: translateX(0);}
  to {transform: translateX(${width}px);}
`

const StyledWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  right: 4px;
  border-radius: 8px;
  background-color: #d9d2b0;
  z-index: 9999;
  display: flex;
  flex-direction: row;
  animation: ${props => props.animation ? slide(props.width) : slideOut(props.width)} .5s;
  transform-origin:${props => props.animation ? 'left' : 'right'};
  padding: 8px 8px 8px 32px;
  opacity: ${props => props.width ? 1 : 0};
  max-width: 80%;
  max-height: 20%;
  overflow: scroll;

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
`

const StyledFigure = styled.div`
  position: relative;
  box-sizing: border-box;
  width: ${props => props.width / 2}px;
  height: ${props => props.height / 2}px;
  transform: ${props => `rotate(${props.rotate}deg)`};
  background-color: ${props => props.backgroundColor};
  border-radius: ${props => props.radius}%;
  border: ${props => `${props.borderSize}px ${props.borderType} ${props.borderColor}`};
  font-size: ${props => props.fontSize}px;
  font-weight: ${props => props.fontWeight};
  color: ${props => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  &:active {
    opacity: .75;
  }
`;

const WrapperFigured = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`

const AddFigure = styled.div`
    position:absolute;
    top: 2px;
    left: 2px;
    background-color: transparent;
`

const StyledIconButton = styled(IconButton).attrs({
    size: 'small'
})`
    &:focus {
      outline: none;
    }
`

const GraphExampleElements = ({open: openProps,}) => {
    const [open, setOpen] = useState(false)
    const [openAdd, setOpenAdd] = useState(false);
    const [openAccept, setOpenAccept] = useState(false);
    const [elements, setElements] = useState([]);
    const [width, setWidth] = useState(0);
    const [idToRemove, setIdToRemove] = useState(0);

    const ref = useRef(null);

    const {id: paramId} = useParams();

    const reduxElements = useSelector(state => state.graph.template)

    const [cookies,] = useCookies();

    const dispatch = useDispatch();

    useEffect(() => {
        if (reduxElements.length) setElements(reduxElements)
    }, [reduxElements])

    useEffect(() => {
        if (ref.current) {
            setWidth(ref.current.clientWidth)
        }
    })

    useEffect(() => {
        if (openProps) setOpen(true)
    }, [openProps])

    const onAnimationEnd = () => {
        if (!openProps) setOpen(false)
    }

    const onClick = async (e) => {
        const style = JSON.parse(e.target.dataset.value)
        const newElement =
            {
                graph_id: parseInt(paramId),
                id: style.id.toString(),
                type: 'square',
                data: {
                    label: '',
                    style,
                },
                position: {x: 200, y: 200},
            }
        if (paramId) {
            await postData('/graph/add', newElement, cookies)
            dispatch(fetchGraph(cookies))
        } else {
            alert('Najpierw wybierz zakładkę')
        }
    }

    const handleOpenAcceptWindow = (e) => {
        e.preventDefault()
        const {id} = e.target;
        if (id < 0) {
            alert('NIe można usunąć domyślnego elementu')
        } else {
            setIdToRemove(id)
            setOpenAccept(!openAccept)
        }
    }

    const handleRemoveTemplate = async () => {
        try {
            await deleteData(`/singleElements/${idToRemove}`, cookies)
            setOpenAccept(false);
            dispatch(fetchGraphTemplate(cookies))
        } catch (e) {

        }
    }

    const handleAddElement = () => {
        setOpenAdd(!openAdd)
    }

    return (
        <Fragment>
            {open ? (
                <StyledWrapper
                    ref={ref}
                    onAnimationEnd={onAnimationEnd}
                    animation={openProps}
                    width={width}
                >
                    <AddFigure>
                        <StyledIconButton
                            onClick={handleAddElement}
                        >
                            <AddIcon
                                style={{color: 'yellowgreen'}}
                            />
                        </StyledIconButton>
                    </AddFigure>
                    <WrapperFigured>
                        {elements.map(element => (
                            <StyledFigure
                                id={element.id}
                                key={element.id}
                                width={element.width}
                                height={element.height}
                                backgroundColor={element.backgroundColor}
                                radius={element.radius}
                                borderSize={element.borderSize}
                                borderType={element.borderType}
                                borderColor={element.borderColor}
                                fontSize={element.fontSize}
                                fontWeight={element.fontWeight}
                                color={element.color}
                                rotate={element.rotate}
                                data-value={JSON.stringify(element)}
                                onClick={onClick}
                                onContextMenu={handleOpenAcceptWindow}
                            />
                        ))}
                    </WrapperFigured>

                </StyledWrapper>
            ) : null}


            <AddNewElementWindow open={openAdd} setOpen={setOpenAdd}/>
            <AcceptWindow
                open={openAccept}
                handleClose={setOpenAccept}
                handleApproved={handleRemoveTemplate}
            >
                Czy na pewno chcesz usunąć ten element?
            </AcceptWindow>
        </Fragment>
    );
};

export default GraphExampleElements;
