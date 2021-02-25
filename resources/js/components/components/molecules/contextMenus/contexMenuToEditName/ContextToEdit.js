import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

const initialState = {
    mouseX: null,
    mouseY: null,
};


const ContextToEdit = ({children, setDisable}) => {
    const [state, setState] = React.useState(initialState);

    const handleClick = (event) => {
        event.preventDefault();
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    const handleChangeName = () => {
        setDisable(false);
        setState(initialState);
    };


    const handleClose = () => {
        setState(initialState);
    };

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
                    <MenuItem onClick={handleChangeName}>Edytuj</MenuItem>
                </Menu>
            </div>
        </React.Fragment>
    );
};


export default ContextToEdit;
