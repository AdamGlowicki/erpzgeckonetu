import React, {useReducer} from 'react';
import styled from 'styled-components';
import {useCookies} from "react-cookie";
import {useSelector} from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import {deleteData, handleErrorApi, patchData} from "../../../../common/apiMethods/apiMethods";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const SingleUserPerm = ({checked: propsChecked, userId, putUrl, deleteUrl, setPermissions}) => {
    const [cookies,] = useCookies();
    const [checkedGroup, setChecked] = useReducer((prev, current) => ({...prev, ...current}),
        propsChecked,
        (init) => ({
            warehouseman: init.warehouseman,
            driver: init.driver,
            admin: init.admin
        })
    )
    const user = useSelector(state => state.user.users.filter(user => user.id === userId))[0]

    const changePermission = handleErrorApi(async (putUrl, userId, checkedGroup, cookies) => {
        const data = await patchData(`${putUrl}/${userId}`, {...checkedGroup}, cookies)
        setPermissions(data.data)
    })


    const handleCheckboxes = (checkedGroup, name, checked) => {
        const checkboxes = {...checkedGroup};
        Object.keys(checkboxes).forEach(key => {
            checkboxes[key] = false
        })

        checkboxes[name] = checked

        return checkboxes
    }

    const handleChange = async (e) => {
        const {checked, name} = e.target

        const checkboxes = handleCheckboxes(checkedGroup, name, checked)

        await setChecked(checkboxes)

        await changePermission(putUrl, userId, checkboxes, cookies)
    }

    const handleRemovePermission = async () => {
        try {
            const data = await deleteData(`${deleteUrl}/${userId}`, cookies)
            setPermissions(data.data)
        } catch (e) {
        }
    }

    return (
        <StyledWrapper>
            <input
                name='warehouseman'
                className='mr-2'
                type="checkbox"
                checked={checkedGroup.warehouseman}
                onChange={handleChange}
            />
            <input
                name='driver'
                className='mr-2'
                type="checkbox"
                checked={checkedGroup.driver}
                onChange={handleChange}
            />
            <input
                name='admin'
                className='mr-2'
                type="checkbox"
                checked={checkedGroup.admin}
                onChange={handleChange}
            />

            <div>{user ? user.name : null}</div>

            <IconButton
                className='ml-1'
                size='small'
                style={{color: 'red'}}
                onClick={handleRemovePermission}
            >
                <DeleteOutlineIcon fontSize='small'/>
            </IconButton>
        </StyledWrapper>
    );
};

export default SingleUserPerm;
