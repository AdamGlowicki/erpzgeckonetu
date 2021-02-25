import React, {Fragment} from 'react';
import GenerateMiddleStage from "../generateMiddleStage/GenerateMiddleStage";

const GeneratedInvestment = ({stages, rolled}) => {
    return (
        <Fragment>
            {stages && stages.map((stage) => <GenerateMiddleStage rolled={rolled} key={stage.id} stage={stage}/>)}
        </Fragment>
    );
};

export default GeneratedInvestment;
