import React from 'react';
import ScannerOutlinedIcon from '@material-ui/icons/ScannerOutlined';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const ColorButton = withStyles((theme) => ({
    root: {
        color: 'white',
        backgroundColor: 'rgb(162,198,0)',
        width: '100%',
        textTransform: 'none',
        fontWeight: '500',
        fontSize: '12px',
        '&:hover': {
            backgroundColor: 'rgb(162,198,100)',
        },
    },
}))((props) => <Button {...props}/>);


const StartScan = ({withBackground, size, big, setOpen,}) => {

    return (
        <div className='m-2'>
            {big ? (
                <ColorButton
                    onClick={() => setOpen(true)}
                    endIcon={
                        <Tooltip title='Prześlij ze skanera.'>
                            <ScannerOutlinedIcon style={{color: withBackground ? 'white' : 'yellowgreen'}}
                                                 fontSize={size}/>
                        </Tooltip>
                    }
                >
                    Prześlij
                </ColorButton>

            ) : (
                <IconButton
                    size={size}
                    style={{background: withBackground && 'yellowgreen'}}
                    onClick={() => setOpen(true)}
                >
                    <Tooltip title='Prześlij ze skanera.'>
                        <ScannerOutlinedIcon style={{color: withBackground ? 'white' : 'yellowgreen'}} fontSize={size}/>
                    </Tooltip>
                </IconButton>
            )}
        </div>
    );
};

export default StartScan;
