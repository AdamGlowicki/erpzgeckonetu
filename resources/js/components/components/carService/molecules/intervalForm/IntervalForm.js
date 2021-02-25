import React from 'react';
import styled from 'styled-components';
import {useForm} from "react-hook-form";
import Input from "../../atoms/input/Input";
import PermDeviceInformationIcon from '@material-ui/icons/PermDeviceInformation';
import {handleErrorApi, patchData, postData} from "../../../../common/apiMethods/apiMethods";
import {useCookies} from "react-cookie";

const StyledWrapper = styled.div.attrs({
    className: 'p-2'
})`
    min-width: 300px;
`

const Title = styled.div.attrs({
    className: 'mb-2'
})`
  display: flex;
  flex-direction: row;
`

const Form = styled.form.attrs({
    className: 'pl-2'
})`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

const StyledLabel = styled.label.attrs({
    className: 'mt-2 ml-1'
})`
  font-size: 12px;
  margin-bottom: 4px;
  font-weight: 400;
`

const StyledError = styled.div`
 color: red;
 font-size: 10px;
 font-weight: 600;
 margin-left: 4px;
`

const Button = styled.button`
  border-radius: 4px;
  border: 1px solid whitesmoke;
  background-color: yellowgreen;
  padding: 4px;
  margin-top: 8px;
  color: white;
  font-weight: 600;
  align-self: flex-end;
`

const IntervalForm = ({restriction, setRestriction, setOpen}) => {
    const [cookies,] = useCookies()

    const {register, handleSubmit, errors} = useForm({
        mode: 'onBlur'
    });

    const handleSaveRestriction = handleErrorApi(async (data) => {
        const response = await postData('alertPeriod/create', data, cookies)
        setRestriction(response.data)
    })

    const handleUpdateRestriction = handleErrorApi(async (data) => {
        const response = await patchData(`alertPeriod/update/${restriction.id}`, data, cookies)
        setRestriction(response.data)
    })

    const onSubmit = data => {
        if (restriction) {
            handleUpdateRestriction(data)
        } else {
            handleSaveRestriction(data)
        }

        setOpen(false)
    }

    return (
        <StyledWrapper>
            <Title>
                <PermDeviceInformationIcon style={{color: 'yellowgreen'}}/>
                <div>
                    Ustaw parametry po przekroczeniu których włączy się alert.
                </div>
            </Title>

            <Form onSubmit={handleSubmit(data => onSubmit(data))}>
                <StyledLabel>Ilość kilometrów przed przeglądem</StyledLabel>
                <Input
                    placeholder='km'
                    name='kms'
                    type='number'
                    min={0}
                    max={5000}
                    step={100}
                    defaultValue={restriction.kms}
                    refData={register({required: true})}
                />
                {errors.kms && <StyledError>Pole wymagane</StyledError>}


                <StyledLabel>Ilość dni przed przeglądem</StyledLabel>
                <Input
                    placeholder='dni'
                    name='days'
                    type='number'
                    min={0}
                    max={30}
                    defaultValue={restriction.days}
                    refData={register({required: true})}
                />
                {errors.days && <StyledError>Pole wymagane</StyledError>}

                <Button type='submit'>Zapisz</Button>
            </Form>
        </StyledWrapper>
    );
};

export default IntervalForm;
