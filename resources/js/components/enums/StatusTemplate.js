import CellsColor from './CellsColor';

export const statusTemplate  = [
    {id: 1, label: 'Zakończone', value: CellsColor.Finish},
    {id: 2, label: 'Rozpoczęte/ w toku', value: CellsColor.Started},
    {id: 3, label: 'Do sprawdzenia', value: CellsColor.ToCheck},
    {id: 4, label: 'Etap do wdrożenia', value: CellsColor.ToDeploy},
    {id: 5, label: 'Niezdefiniowany', value: CellsColor.Empty},
];
