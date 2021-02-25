import React, {Fragment, useState} from 'react';
import styled, {css} from 'styled-components';
import {useForm} from "react-hook-form";
import TabIcon from '@material-ui/icons/Tab';
import AcceptWindow from "../../../molecules/acceptWindow/AcceptWindow";
import {deleteData, patchData, postData} from "../../../../common/apiMethods/apiMethods";
import {useCookies} from "react-cookie";
import {useDispatch} from "react-redux";
import {fetchGraph} from "../../../../reducers/graph/duck/operations";
import {useHistory} from "react-router";

const StyledWrapper = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
`

const StyledButton = styled.button`
  border-radius: 4px;
  border: 1px solid whitesmoke;
  background-color: yellowgreen;
  padding: 4px;
  color: white;
  font-weight: 600;
  align-self: flex-end;

  ${({second}) => (
    second && css`
        background: red;
  `
)}
`

const StdError = styled.div`
 color: red;
 font-size: 10px;
 font-weight: 600;
 margin-left: 4px;
`

const StyledLabel = styled.label.attrs({
    className: 'mt-2 ml-1'
})`
  font-size: 12px;
  margin-bottom: 4px;
  font-weight: 400;
`

const StyledInput = styled.input`
  min-width: 40%;
  border: 1px solid black;
  border-radius: 4px;
  padding: 4px;
  transition: 200ms;
  font-size: 12px;

  &:focus {
    outline: none;
    border: 2px solid yellowgreen;
  }

  ${({uppercase}) => (
    uppercase && css`
        text-transform: uppercase;
      `
)}
`

const Title = styled.div.attrs({
    className: 'p-2'
})`
  font-size: 20px;
  font-weight: 600;
`

const TabContent = ({name, id, setOpen: propsSetOpen}) => {
    const {register, handleSubmit, errors} = useForm({mode: 'onBlur'})
    const [open, setOpen] = useState(false);

    const [cookies,] = useCookies();
    const dispatch = useDispatch();

    const history = useHistory();

    const handleRemove = async (e) => {
        e.preventDefault()
        try {
            await deleteData(`graph/deleteGraph/${id}`, cookies)
            history.push('/react/graph')
            dispatch(fetchGraph(cookies))
        } catch (e) {
            console.log(e)
        }
    }

    const onSubmit = async (data) => {
        try {
            if (id) {
                await patchData(`/graph/updateName/${id}`, data, cookies)
            } else {
                await postData('graph/addGraph', data, cookies);
            }
            await dispatch(fetchGraph(cookies));
        } catch (e) {
        }
        propsSetOpen(false)
    }

    return (
        <Fragment>
            <StyledWrapper>
                <div className='d-flex flex-row align-items-center'>
                    <TabIcon fontSize={"small"}/>
                    <Title>{name}</Title>
                </div>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className='d-flex flex-column justify-content-start align-items-start mb-3'>
                        <StyledLabel>Nazwa zakładki</StyledLabel>
                        <StyledInput
                            placeholder='Nazwa'
                            type='text'
                            name='name'
                            defaultValue={name}
                            ref={register({required: true, minLength: 2})}
                        />
                        {errors.name == null ? undefined : errors.name.type === 'required' && (
                            <StdError>Wymagane pole</StdError>)}
                        {errors.name == null ? undefined : errors.name.type === 'minLength' && (
                            <StdError>Pole musi zawierać conajmniej 2 znaki</StdError>
                        )}
                    </div>

                    <div className='d-flex flex-row justify-content-end p-2'>
                        <StyledButton
                            type='submit'
                        >
                            Zapisz
                        </StyledButton>

                        {id && (
                            <StyledButton
                                type='button'
                                second
                                onClick={() => setOpen(!open)}
                            >
                                Usuń
                            </StyledButton>
                        )}
                    </div>
                </Form>
            </StyledWrapper>

            <AcceptWindow
                open={open}
                handleClose={setOpen}
                handleApproved={handleRemove}
            >
                Czy na pewno chcesz usunąć {name}?
            </AcceptWindow>
        </Fragment>

    );
};

export default TabContent;
