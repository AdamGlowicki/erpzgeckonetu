import CellsColor from '../enums/CellsColor';

export const generateTasks = (arrName, id) => {
    const generatedArr = [...arrName];
    const basicObject = {
        notes: 'Pusta notatka',
        mini_note: 'mini notatka',
        status: CellsColor.Empty,
        invest_id: id,
    };
    return generatedArr.map((name, i) => ({...basicObject, name: name, position: i + 1}));
}
