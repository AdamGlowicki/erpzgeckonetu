export const groupedStageList = (stages) => {
    let stageList = [];

    const groupStage = (stages) => {
        let newArray = [...stages];
        return (
            newArray.map((stage) => {
                if (Array.isArray(stage.stages)) {
                    stageList = [...stageList, stage]
                    return groupStage(stage.stages)
                }
                stageList = [...stageList, stage]
            })
        );
    };

    groupStage(stages)

    return stageList
}
