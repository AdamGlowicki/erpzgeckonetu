import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import Tooltip from '@material-ui/core/Tooltip';

const useStyle = makeStyles(theme => ({
    root: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    }
}));

const ActionTableIcons = ({handleDeleteTable, handleAddRow, percent}) => {
    return (
        <div className='mt-1 d-flex flex-row align-items-center'>
            <div className={'mr-5'}>
                {percent} %
            </div>
            <Tooltip title='Dodaj wiersz'>
                <IconButton  size='small' aria-label="add" color={'primary'} onClick={handleAddRow}>
                    <PlaylistAddIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title='Usuń tabelę'>
                <IconButton className={useStyle().root} aria-label="delete" color={'secondary'} onClick={handleDeleteTable}>
                    <DeleteIcon/>
                </IconButton>
            </Tooltip>
        </div>
    );
};

export default ActionTableIcons;
