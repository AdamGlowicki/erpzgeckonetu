import React, {useEffect, useState} from 'react';
import PostAddIcon from '@material-ui/icons/PostAdd';
import styled, {keyframes} from 'styled-components';
import {useCookies} from "react-cookie";
import {getData} from "../../../common/apiMethods/apiMethods";
import {getToday} from "../../../common/globalMethods";
import Button from '@material-ui/core/Button';
import {useSelector} from "react-redux";
import DraggableModal from "../draggableModal/DraggableModal";
import InvestmentBriefcase from "../investmentBriefcase/InvestmentBriefcase";

const move = keyframes`
  from {
    top: 0;
    right: 0;
    opacity: 0;
  }
  to {
    top: 4%;
    right: 4%;
    opacity: 1;
  }
`

const StyledWrapper = styled.div`
  position: fixed;
  top: 4%;
  right: 4%;
  animation: ${move} 1.5s;
`

const AddInvestmentButton = () => {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState('');

    const [cookies, setCookie] = useCookies(['name'])

    const asyncGetUser = async () => {
        try {
            const result = await getData(`/loggedUser/${cookies.userId}`, cookies)
            setUser(result.data)
        } catch (e) {}
    }

    useEffect(() => {
        asyncGetUser()
    }, [])

    const defaultOptions = {id: null, country: '', stage_name: '', adder: user, add_date: getToday(), description: '', address: '', files: null}

    return (
        <React.Fragment>
            <StyledWrapper>
                <Button
                    onClick={() => setOpen(true)}
                    variant="contained"
                    style={{background: '#ac0', color: 'white'}}
                    startIcon={<PostAddIcon />}
                >Nowa Inwestycja</Button>
            </StyledWrapper>
            <DraggableModal open={open} setOpen={setOpen}>
                <InvestmentBriefcase stage={defaultOptions} setOpen={setOpen}/>
            </DraggableModal>
        </React.Fragment>
    );
};

export default AddInvestmentButton;
