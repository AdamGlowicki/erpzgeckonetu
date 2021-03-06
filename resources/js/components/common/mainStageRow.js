import CellsColor from '../enums/CellsColor';

export const defaultMainStage = (ids) => {
    const arr = [
        {
            name: 'Wizja',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Projekt',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Uzgodnienie Projektu',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'MDCP',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'ZUD',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'P.O.R.',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Zajęcie pasa',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Wytyczanie lini kablowej',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Trasa do PD zaciąg',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Spawanie',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Trasa od PD',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Spawanie',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Odbiór',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Inwentaryzacja',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
    ];
    return [...arr.map((item, index) => ({id: ids[index], ...item}))]

};

export const postForTransmitter = (ids) => {
    const arr = [
        {
            name: 'Wypis z rejestru gruntów',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Mapa zasadnica',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Decyzje dysponowania projektu',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'MDCP',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'ZUD',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Projekt zagospodarowania terenu',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Zgłoszenie zagospodarowania terenu',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Zajęcie pasa',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Dokumenty powykonawcze',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
    ];

    return [...arr.map((item, index) => ({id: ids[index], ...item}))]
};

export const wiredLines = ids => {
    const arr = [
        {
            name: 'Uwzględnienia dokumentacji',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Projekt wykonawczy',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Decyzja dysponowania gruntem',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Decfyzja organizacji ruchu',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Zajęcie pasa',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Zawiadomienie posterunku ENEA/ENERGA',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
        {
            name: 'Dokumentacja powykonawcza',
            notes: 'Pusta notatka',
            miniNote: 'mini notatka',
            folders: [],
            files: '',
            table: '',
            color: CellsColor.Empty,
        },
    ];

    return [...arr.map((item, index) => ({id: ids[index], ...item}))]
};
