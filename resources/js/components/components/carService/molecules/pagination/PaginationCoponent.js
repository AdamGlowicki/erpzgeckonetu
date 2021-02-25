import React from 'react';
import Pagination from '@material-ui/lab/Pagination';
import PropTypes from 'prop-types';


const PaginationComponent = ({setPage, page, pagesNumber}) => {
    const handleChange = (e, page)=> {
        setPage(page)
    }

    return (
        <div className='w-100 d-flex flex-row justify-content-center m-5'>
            <Pagination
                onChange={handleChange}
                count={pagesNumber}
                page={page}
                siblingCount={0}
            />
        </div>
    );
};

PaginationComponent.propTypes = {
    setPage: PropTypes.func,
    page: PropTypes.number.isRequired,
    pagesNumber: PropTypes.number.isRequired,
}

export default PaginationComponent;
