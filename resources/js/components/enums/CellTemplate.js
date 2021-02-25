import CellsColor from './CellsColor';

export const cellTemplate = (id) => ({
    id,
    name: 'Etap',
    notes: 'Pusta notatka',
    miniNote: 'mini notatka',
    status: CellsColor.Empty,
    position: 0,
});
