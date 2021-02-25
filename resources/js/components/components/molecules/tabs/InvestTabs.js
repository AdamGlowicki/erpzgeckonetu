import React, {Fragment, useCallback, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {withStyles} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import styled, {keyframes} from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import DraggableModal from "../draggableModal/DraggableModal";
import DrawerForm from "../drawerFrom/DrawerForm";

const StyledTab = withStyles({
    root: {
        color: 'white',
        minWidth: '100px',
        maxHeight: '40px',
        animation: '$move 500ms'
    },
    textColorPrimary: {
        '&.MuiTab-textColorPrimary.Mui-selected': {
            color: 'white',
            fontWeight: '900',
            outline: 'none',
        },
        '&.MuiTab-textColorPrimary': {
            color: 'white',
            fontWeight: '100'
        }
    },
    '@keyframes move': {
        from: {
            opacity: 0,
            transform: 'scaleX(0)'
        },
        to: {
            opacity: 1,
            transform: 'scaleX(1)'
        }
    }
})(props => <Tab {...props}/>);

const StyledTabs = withStyles({
    root: {
        background: 'yellowgreen',
        padding: 0,
    },
    indicator: {
        '&.MuiTabs-indicator': {
            backgroundColor: 'white',
        }
    }

})(props => <Tabs {...props}/>);

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
  display: flex;
  flex-direction: row;
  animation: ${slide} 1s;
  transform-origin: 0 0 ;
`

const StyledLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const InvestTabs = ({handleClick, drawers}) => {
    const [value, setValue] = React.useState(0);
    const [open, setOpen] = useState(false);
    const [drawer, setDrawer] = useState({})

    const handleChange = (event, newValue) => {
        setValue(newValue)
    };

    const handleOpenDrawerForm = (id) => {
        setDrawer(drawers.filter(drawer => drawer.id === id)[0])
        setOpen(!open)
    }

    const handleOpenAddDrawer = () => {
        setDrawer({id: null, name: ''})
        setOpen(!open)
    }

    return (
        <StyledWrapper>
            <div>
                <Paper square>
                    <StyledTabs
                        value={value}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleChange}
                        aria-label="disabled tabs example"
                    >
                        <StyledTab onClick={handleClick} label='Wszystkie'/>
                        {drawers && drawers.map(item => (
                            <StyledTab component='div' key={item.id}
                                       onClick={handleClick}
                                       label={
                                           <StyledLabel>
                                               <div>
                                                   <IconButton size='small' onClick={() => handleOpenDrawerForm(item.id)}>
                                                       <EditIcon  style={{color: 'white', fontSize: '16px'}}/>
                                                   </IconButton>
                                               </div>
                                               <div>{item.name}</div>
                                           </StyledLabel>
                                       }
                            />

                        ))}
                        <StyledTab onClick={handleClick} label='Nieprzypisane'/>
                    </StyledTabs>
                </Paper>
            </div>
            <div>
                <Tooltip title={"Dodaj szufladę."}>
                    <IconButton onClick={handleOpenAddDrawer} color="primary" aria-label="upload picture">
                        <AddIcon style={{color: 'yellowgreen',}}/>
                    </IconButton>
                </Tooltip>
            </div>
            <DraggableModal open={open} setOpen={setOpen}>
                <DrawerForm drawer={drawer} setClose={setOpen}/>
            </DraggableModal>

        </StyledWrapper>
    );
}

export default InvestTabs;
