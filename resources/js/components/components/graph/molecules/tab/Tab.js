import React, {Fragment, useState} from 'react';
import styled from 'styled-components';
import {NavLink} from "react-router-dom";
import EditIcon from '@material-ui/icons/Edit';
import IconButton from "@material-ui/core/IconButton";
import DraggableModal from "../../../molecules/draggableModal/DraggableModal";
import TabContent from "../tabContent/TabContent";
import {deleteData} from "../../../../common/apiMethods/apiMethods";

const StyledLi = styled.li.attrs({
    className: 'ml-2'
})`
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-radius: 4px;
`

const activeClassName = 'nav-item-active'
const StyledLink = styled(NavLink).attrs({
    activeClassName,
    className: 'pl-4 pr-4 pt-1 pb-1',
})`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 18px;
  font-weight: 500;
  border-radius: 4px;
  background-color: yellowgreen;
  border: 2px solid yellowgreen;
  transition: .1s;

  &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
        text-transform: none;
        color: white;
  }

  &.${activeClassName} {
    background-color: white;
    color: yellowgreen;
  }
`

const Tab = ({id, name, permission}) => {
    const [open, setOpen] = useState(false);

    const handleRemove = async () => {
        try {
            await deleteData(`graph/delete/${id}`, cookies)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Fragment>
            <StyledLi>
                {permission && (
                    <div
                        style={{height: '100%', background: 'yellowgreen', borderRadius: '4px'}}
                        className='d-flex justify-content-center align-items-center p-1'
                    >
                        <IconButton onClick={() => setOpen(!open)} size='small'>
                            <EditIcon fontSize='small' style={{color: 'white'}}/>
                        </IconButton>
                    </div>
                )}
                <StyledLink to={`/react/graph/${id}`}>
                    {name}
                </StyledLink>
            </StyledLi>

            <DraggableModal
                setOpen={setOpen}
                open={open}

            >
                <TabContent
                    setOpen={setOpen}
                    name={name}
                    id={id}
                />
            </DraggableModal>
        </Fragment>
    );
};

export default Tab;
