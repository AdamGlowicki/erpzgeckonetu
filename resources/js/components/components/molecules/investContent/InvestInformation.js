import React, {useState} from 'react';
import styled, {keyframes, css} from 'styled-components';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import {useSelector} from "react-redux";
import {isAllow, limitString} from "../../../common/globalMethods";
import {AppPerm} from "../../../enums/permissions/permissions";
import {withStyles} from "@material-ui/core/styles";
import InvestmentBriefcase from "../investmentBriefcase/InvestmentBriefcase";
import DraggableModal from "../draggableModal/DraggableModal";
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import PersonIcon from '@material-ui/icons/Person';
import DescriptionIcon from '@material-ui/icons/Description';
import PublicIcon from '@material-ui/icons/Public';
import OpenInBrowserSharpIcon from '@material-ui/icons/OpenInBrowserSharp';
import AddMiddleInvestForm from "../addMiddleInvestForm/AddMiddleInvestForm";
import InfoItem from "../../atoms/infoItem/InfoItem";

const extension = keyframes`
  from {transform: scaleY(0)}
  to {transform: scaleY(1)}
`

const slide = keyframes`
  from {
    transform: scaleX(0);
    opacity: 0;
  }
  to {
    transform: scaleX(1);
    opacity: 1;
  }
`

const StyledWrapper = styled.div`
position: relative;
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns:auto 35% 1fr;
  background-color: #fff;
  border-radius: 4px;
  margin-top: 16px;
  width: 80vw;
  transform-origin: 50% 0 ;
  animation: ${extension} 1s;
`;

const StyledHead = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  grid-row: 1 / 2;
  grid-column: 2 / 3;
  margin: 4px 0 8px 0;
`

const StyledMiniInvestment = styled.div.attrs({
    className: 'mt-1 mb-1'
})`
  grid-row: 1 / 2;
  grid-column: 3 / -1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  transform: scaleX(calc(1050 / (184 + 24  + (104 * ${props => props.longestLine <= 8 ? 8 : props.longestLine})))) scaleY(calc(60 / 57 / (${({numberOfLines}) => numberOfLines === 1 ? 2 : numberOfLines })));
  transform-origin: top left;
  position: absolute;
  transition: .5s;
  z-index: 1000;

  &:hover {
    transform: scale(1) translateX(-30%);
    border: 1px solid yellowgreen;
    border-radius: 8px;
    width: 130%;
    overflow-x: scroll;
    z-index: 1001;
    background-color: white;
    &::-webkit-scrollbar{
    height: 12px;
    }
    &::-webkit-scrollbar-track {
    background: #f1f1f1;
    }
    &::-webkit-scrollbar-thumb {
    background: #ac0;
    }
  }
`

const StyledDescription = styled.div`
  grid-column: 1 / -1;
  grid-row: 1 / 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 12px;
`

const StyledRolledWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 25% 1fr;
  justify-content: left;
  animation: ${slide} 1s;
  transform-origin: left;
  position: relative;
`

const StyledInfoWrapper = styled.div.attrs({
    className: 'ml-3'
})`
  grid-column: 3 / -1;
  grid-row: 1 / -1;
`

const StyledInfoHead = styled.div.attrs({
    className: 'mb-1'
})`
  font-size: 16px;
  font-weight: bold;
`
const InfoWrapper = styled.section.attrs({
    className: 'ml-2'
})`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
  margin-right: 16px;
  font-size: 12px;
`

const StyledRolledButton = styled.div.attrs({
    className: 'mt-2 ml-2'
})`
  grid-column: 1 / 2;
`

const StyledTooltip = withStyles({
    touch: {
        fontSize: '40px'
    }
})(Tooltip)

const rotate = keyframes`
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(180deg);
  }
`
const reversRotate = keyframes`
  from {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(0);
  }
`

const StyledRollIcon = styled(OpenInBrowserSharpIcon)`
  transform: ${props => props.rotate ? 'rotate(none)' : 'rotate(180deg)'};
  animation: ${rotate} 1s;
  ${({rotate}) => (
      rotate && css`
          animation: ${reversRotate} 1s;
      `
    )}
`

const Info = ({stage}) => (
    <InfoWrapper>
        <InfoItem icon={<LocationCityIcon fontSize='small'/>} title='Miejscowość:' value={stage.country}/>
        <InfoItem icon={<PublicIcon fontSize='small'/>} title='Nazwa (Powiat, Gmina):' value={stage.stage_name}/>
        <StyledTooltip title={<div style={{fontSize: '16px'}}>{stage.description}</div>}>
            <div>
                <InfoItem icon={<DescriptionIcon fontSize='small'/>} title='Opis:'
                          value={limitString(stage.description, 30)}/>
            </div>
        </StyledTooltip>
    </InfoWrapper>
)

const InvestInformation = ({stage, generatedInvestment, numberOfLines, longestLine, rolled, setRolled}) => {

    const [open, setOpen] = useState(false);
    const [openAddInvestment, setOpenAddInvestment] = useState(false)

    const permission = useSelector(state => state.investments.permissions)
    const allowOpenEdit = permission && isAllow(permission, [AppPerm.OPEN_INVEST])
    return (
        <React.Fragment>
            {!rolled ? (
                <StyledRolledWrapper>
                    <StyledRolledButton>
                        <IconButton onClick={() => setRolled(!rolled)} style={{background: 'yellowgreen'}}  size='small'>
                            <StyledRollIcon/>
                        </IconButton>
                    </StyledRolledButton>

                    <StyledHead>
                        <Tooltip title={'Otwórz edycję teczki.'}>
                            <IconButton disabled={!allowOpenEdit} onClick={() => setOpen(!open)}>
                                <DeveloperBoardIcon fontSize='large'/>
                            </IconButton>
                        </Tooltip>

                        <Info stage={stage}/>
                    </StyledHead>

                    <StyledMiniInvestment numberOfLines={numberOfLines} longestLine={longestLine}>
                        <div style={{background: 'white'}}>
                            {generatedInvestment}
                        </div>
                    </StyledMiniInvestment>
                </StyledRolledWrapper>
            ) : (
                <StyledWrapper>
                    <StyledRolledButton>
                        <IconButton onClick={() => setRolled(!rolled)} style={{background: 'yellowgreen'}}  size='small'>
                            <StyledRollIcon rotate='true'/>
                        </IconButton>
                    </StyledRolledButton>

                    <StyledHead>
                        <div className='d-flex flex-column'>
                            <Tooltip title={'Otwórz edycję teczki.'}>
                                <IconButton disabled={!allowOpenEdit} onClick={() => setOpen(!open)}>
                                    <DeveloperBoardIcon/>
                                </IconButton>
                            </Tooltip>

                            <Tooltip title={'Dodaj główną inwestycję.'}>
                                <IconButton disabled={!allowOpenEdit}
                                            onClick={() => setOpenAddInvestment(!openAddInvestment)}>
                                    <LibraryAddIcon/>
                                </IconButton>
                            </Tooltip>
                        </div>

                        <Info stage={stage}/>
                    </StyledHead>

                    <StyledInfoWrapper>
                        <StyledDescription>
                            <StyledInfoHead>Opis</StyledInfoHead>
                            <div>{stage.description}</div>
                        </StyledDescription>
                    </StyledInfoWrapper>
                </StyledWrapper>
            )}

            <DraggableModal open={open} setOpen={setOpen}>
                <InvestmentBriefcase stage={stage} setOpen={setOpen}/>
            </DraggableModal>

            <DraggableModal open={openAddInvestment} setOpen={setOpenAddInvestment}>
                <AddMiddleInvestForm stage={stage} close={() => setOpenAddInvestment(false)}/>
            </DraggableModal>
        </React.Fragment>
    );
};

InvestInformation.propTypes = {};

export default InvestInformation;
