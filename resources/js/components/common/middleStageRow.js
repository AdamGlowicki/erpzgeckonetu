
export const defaultStage = (id) => {
    const arr = [
        {
            name: 'Wizja',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 1,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Projekt/Suplement',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            folders: [],
            position: 2,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Zgody/Umowy',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 3,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Uzbrojenie Piony',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 4,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Spawania',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 5,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Odbiór',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 6,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
    ]

    return arr
};

export const cabinets = (id) => {
    const arr = [
        {
            name: 'Mapy zasadnicze',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 1,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Projekt na mapie zasadniczej',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 2,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Decyzje dysponowania gruntami',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 3,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
    ];

    return arr;
};

export const compositePost = (id) => {
    const arr = [
        {
            name: 'Wypis z rejestru gruntów',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 1,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Mapa zasadnicza',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 2,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Projekt na mapie zasadniczej',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 3,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Decyzja dysponowania gruntem',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 4,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'MDCP',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 5,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Projekt zagospodarowania terenu',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 6,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Zgłoszenie zamiaru budowlanego (Projekt zagospodarowania terenu)',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 7,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Zajecie pasa drogowego',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 8,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Prowadzenie robót',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 9,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
    ];

    return arr;
};

export const defaultMainStage = (id) => {
    const arr = [
        {
            name: 'Wizja',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 1,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Projekt',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 2,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Uzgodnienie Projektu',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 3,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'MDCP',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 4,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'ZUD',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 5,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'P.O.R.',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 6,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Zajęcie pasa',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 7,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Wytyczanie lini kablowej',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 8,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Trasa do PD zaciąg',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 9,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Spawanie',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 10,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Trasa od PD',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 11,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Spawanie',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 12,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Odbiór',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 13,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Inwentaryzacja',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 14,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
    ];
    return arr

};

export const postForTransmitter = (id) => {
    const arr = [
        {
            name: 'Wypis z rejestru gruntów',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 1,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Mapa zasadnica',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 2,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Decyzja dysponowania gruntem',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 3,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'MDCP',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 4,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'ZUD',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 5,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Projekt zagospodarowania terenu',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 6,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Zgłoszenie zamiaru budowlanego (Projekt zagospodarowania trenu)',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 7,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Zajęcie pasa + prowadzenie robót',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 8,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Dokumemtacja powykonawcza',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 9,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
    ];

    return arr;
};

export const wiredLines = (id) => {
    const arr = [
        {
            name: 'Uzgodnienia dokumentacji z operatorem',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 1,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Oświadczenie działek, Miodek',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 2,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Decyzja dysponowania gruntem',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 3,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Projekt organizacji ruchu',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 4,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Zajęcie pasa + prowadzenie robót',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 5,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Zawiadomienie posterunku ENEA/ENERGA',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 6,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
        {
            name: 'Dokumentacja powykonawcza',
            notes: 'Pusta notatka',
            mini_note: 'mini notatka',
            position: 7,
            status: 'Niezdefiniowany',
            invest_id: id,
        },
    ];

    return arr;
};
