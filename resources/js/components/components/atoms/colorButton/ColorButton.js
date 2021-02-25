import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import React from "react";

export const ColorButton = withStyles((theme) => ({
    root: {
        marginLeft: ({second}) => second && theme.spacing(1),
        color: 'white',
        backgroundColor: 'rgb(162,198,0)',
        '&:hover': {
            backgroundColor: 'rgb(162,198,100)',
        },
    },
}))((props) => <Button {...props}/>);
