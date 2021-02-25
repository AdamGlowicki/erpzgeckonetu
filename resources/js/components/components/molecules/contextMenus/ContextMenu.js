import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

const initialState = {
    mouseX: null,
    mouseY: null,
};

const ContextMenu = ({children, menuItems = () => <div/>}) => {
    const [state, setState] = React.useState(initialState);

    const handleClick = (event) => {
        event.preventDefault();
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    const handleClose = () => {
        setState(initialState);
    };

    const closeContext = () => {
        setState(initialState)
    }

    return (
        <React.Fragment>
            <div onContextMenu={handleClick} style={{cursor: 'context-menu'}}>
                <Typography component='div'>
                    {children}
                </Typography>
                <Menu
                    keepMounted
                    open={state.mouseY !== null}
                    onClose={handleClose}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        state.mouseY !== null && state.mouseX !== null
                            ? {top: state.mouseY, left: state.mouseX}
                            : undefined
                    }
                >
                    {menuItems(closeContext)}
                </Menu>
            </div>
        </React.Fragment>
    );
};

export default ContextMenu;
