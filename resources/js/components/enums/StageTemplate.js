import {STAGES} from './Stages';

export const middleStageTemplate = () => {
    let arr = [
        {id: 1, label: 'Domyślny', value: STAGES.Default},
        {id: 2, label: 'Słupy kompozytowe', value: STAGES.CompositePost},
        {id: 3, label: 'Szafy', value: STAGES.Cabinet},
        {id: 4, label: 'Słupy pod nadajniki', value: STAGES.TransponderPost},
        {id: 5, label: 'Linie kablowe ENEA', value: STAGES.LineEnea},
        {id: 6, label: 'Linie kablowe ENERGA', value: STAGES.LineEnerga},
        {id: 7, label: STAGES.MufaPower, value: STAGES.MufaPower},
        {id: 8, label: STAGES.OltStage, value: STAGES.OltStage},
        {id: 9, label: STAGES.ClientName, value: STAGES.ClientName},
    ];

    return arr.sort((a,b) => a.label.localeCompare(b.label));
};
