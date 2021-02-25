import React from 'react';
import styled, {css} from 'styled-components';
import WarningIcon from "@material-ui/icons/Warning";
import {alertMessage} from "../../../../enums/alertMessage";

const Alert = styled.div`
  position:relative;
  grid-area: alert;
  width: 100%;
  height: 120px;
  border: 2px solid ${props => props.color};
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  padding-left: 4px;
  padding-top: 8px;

  ${({second}) => (
      second && css`
      height: 80px;
`
)}
`
const AlertPadding = styled.div.attrs({
    className: 'w-100 h-100 pr-2 mr-3'
})`
  overflow-y: scroll;

    &::-webkit-scrollbar{
  width: 5px;
  }
  &::-webkit-scrollbar-track {
  background: white;
  }
  &::-webkit-scrollbar-thumb {
  background: red;
  }
`

const AlertTitle = styled.div`
  position: absolute;
  left: 12px;
  top: 0;
  transform: translateY(-50%);
  padding: 2px;
  border: 2px solid ${props => props.color};
  border-radius: 4px;
  font-size: 8px;
  background-color: #fff;
`

const SingleAlert = ({message, second}) => {
    return (
        <div className='d-flex flex-row align-items-center ml-1 p-1'>
            <WarningIcon fontSize='small' style={{color: 'red'}}/>
            <div style={{fontSize: second ? '10px' : '14px', color: 'red', fontWeight: 500}}>
                {message}
            </div>
        </div>
    )
}

const DisplayAlerts = ({alerts, second}) => {
    return (
        <Alert
            second={second}
            color={alerts.length ? 'red' : 'black'}
        >
            {second && <AlertTitle color={alerts.length ? 'red' : 'black'}>Aktywne alarmy</AlertTitle>}

            <AlertPadding>
                {alerts.map(alert => (
                    <SingleAlert
                        second={second}
                        key={alert.id}
                        message={alertMessage(alert.kms, alert.days, alert.type)}
                    />
                ))}
            </AlertPadding>
        </Alert>
    );
};

export default DisplayAlerts;
