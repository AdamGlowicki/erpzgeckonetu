import React, {useEffect, useRef, useState} from 'react';
import CellTemplate from '../../../template/CellTemplate';
import AddCell from '../../molecules/addCell/AddCell';
import styled, {keyframes} from "styled-components";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {Breakpoints} from "../../../enums/sizing/breakpionts";
import {useSelector} from "react-redux";
import {isAllow} from "../../../common/globalMethods";
import {AppPerm} from "../../../enums/permissions/permissions";
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import DateRangeIcon from '@material-ui/icons/DateRange';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import IconButton from '@material-ui/core/IconButton';
import {useFocusRef} from "../../../hooks/useFocusRef";
import AddMiddleInvestForm from "../../molecules/addMiddleInvestForm/AddMiddleInvestForm";
import DraggableModal from "../../molecules/draggableModal/DraggableModal";
import InvestForm from "../../molecules/investContent/InvestForm";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AdditionalInfo from "./AdditionalInfo";
import InfoItem from "../infoItem/InfoItem";

const rotation = keyframes`
  from {
    transform: rotate(0);
    opacity: 0;
  }
  to {
  opacity: 1;
  transform: rotate(720deg);
  }
`

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledHead = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
`

const StyledButtons = styled.div.attrs({})`
  font-weight: 500;
  display: ${props => props.focused ? 'flex' : 'none'};
  flex-direction: column;
  font-size: 14px;
`

const StyledButtonContent = styled.div.attrs({
    className: 'm-2'
})`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-transform: none;
  font-weight: 500;
  font-size: 10px;
  transition: .5s;
`

const StyledAdder = styled.div`
  font-weight: 500;
  font-size: 10px;
`

const StyledDeadline = styled.div`
  font-weight: 500;
  font-size: 10px;
`

const StyledArrow = styled.div`
  animation: ${rotation} 1s;
`

const StyledMoreInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledButton = withStyles({
        root: {
            margin: 0,
            padding: 0,
            width: '100%',
            border: 'none',
            fontSize: '12px',
            fontWeight: "bolder",
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
        },
    }
)((props) => <Button {...props}/>);

const MainCell = ({children, mainColor, message, stageId, singleTask, rolled = true}) => {

    const matches = useMediaQuery(`(max-width:${Breakpoints.MD})`);
    const [open, setOpen] = useState(false);
    const [openAddInvestment, setOpenAddInvestment] = useState(false)
    const [buttonView, setButtonView] = useState(false);
    const [moreView, setMoreView] = useState(false);

    const displayRef = useRef(null)
    const focused = useFocusRef(displayRef)

    useEffect(() => {
        let handler;
        if (focused) {
            handler = setTimeout(() => setButtonView(focused), 700)
        } else {
            setButtonView(focused)
        }
        return () => {
            clearTimeout(handler)
        }
    }, [focused])

    const moreInfoRef = useRef(null);
    const focusMoreInfo = useFocusRef(moreInfoRef)

    useEffect(() => {
        let handler;
        if (focusMoreInfo) {
            handler = setTimeout(() => setMoreView(focusMoreInfo), 200)
        } else {
            setMoreView(focusMoreInfo)
        }
        return () => {
            clearTimeout(handler)
        }
    }, [focusMoreInfo])

    const handleOpen = () => {
     if (rolled) {
         setOpen(true)
     }  else {
         return () => null
     }
    }

    const permission = useSelector(state => state.investments.permissions)
    const allowOpenEdit = permission && isAllow(permission, [AppPerm.OPEN_INVEST])
    const allowAddTask = permission && isAllow(permission, [AppPerm.ADD_TASK])
    return (
        <div>
            <CellTemplate
                focused={buttonView}
                moreInfo={moreView}
                main
                mainColor={mainColor}
                popoverMessage={message}
            >
                <StyledWrapper ref={displayRef}>
                    <StyledHead>
                        <StyledButton onClick={handleOpen} variant="outlined">
                            <StyledButtonContent>
                                {children}
                                <StyledAdder>
                                    <InfoItem
                                        onlyIcon
                                        icon={<PersonIcon style={{fontSize: '12px'}}/>}
                                        value={singleTask.adder}
                                    />
                                </StyledAdder>
                                <StyledDeadline>
                                    <InfoItem
                                        icon={<DateRangeIcon style={{fontSize: '12px'}}/>}
                                        title={'Deadline:'}
                                        value={singleTask.deadline}
                                    />
                                </StyledDeadline>
                            </StyledButtonContent>
                        </StyledButton>

                    </StyledHead>

                    <StyledButtons focused={buttonView}>
                        <div className='d-flex flex-row justify-content-between'>
                            <IconButton onClick={() => setOpenAddInvestment(!openAddInvestment)}>
                                <LibraryAddIcon style={{fontSize: '12px'}}/>
                            </IconButton>
                            <AddCell main disabled={allowAddTask} stageId={stageId} position={0}/>
                        </div>

                        <StyledMoreInfo ref={moreInfoRef}>
                            {buttonView && (<StyledArrow>
                                <ArrowDropDownIcon/>
                            </StyledArrow>)}

                            <AdditionalInfo stage={singleTask} focus={moreView}/>
                        </StyledMoreInfo>

                    </StyledButtons>

                </StyledWrapper>
            </CellTemplate>
            <DraggableModal open={open} setOpen={setOpen}>
                <InvestForm setOpen={setOpen} stage={singleTask} place='MAIN_CELL'/>
            </DraggableModal>

            <DraggableModal open={openAddInvestment} setOpen={setOpenAddInvestment}>
                <AddMiddleInvestForm stage={singleTask} close={() => setOpenAddInvestment(false)}/>
            </DraggableModal>
        </div>

    )
};

export default MainCell;
