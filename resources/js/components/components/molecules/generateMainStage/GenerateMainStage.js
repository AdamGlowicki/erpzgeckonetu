import React from 'react';
import PropTypes from 'prop-types'
import InvestInformation from "../investContent/InvestInformation";

const GenerateMainStage = ({stage, rolled, ...props}) => {
    return (
        <InvestInformation rolled={rolled} stage={stage} {...props}/>
    );
};

GenerateMainStage.propTypes = {
    rolled: PropTypes.bool,
    stage: PropTypes.object,
};

GenerateMainStage.defaultProps = {
    rolled: false
};

export default GenerateMainStage;
