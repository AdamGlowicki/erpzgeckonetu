import CellsColor from '../enums/CellsColor';
import {Countries} from '../enums/Countries';
import {AgreementsStatus} from '../enums/table/agreementsStatus';

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet culpa dolor ducimus laborum magnam'
const lorem2 = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet culpa dolor ducimus laborum magnam22222'

export const simpleCells = [
    {
        id: 1,
        parentId: null,
        stageName: Countries.KWIDZYN,
        files: [
            {
                id: 1,
                url: 'jakis url',
                name: 'Pierwszy szablon.pdf'
            },
            {
                id: 2,
                url: 'jakis url',
                name: 'drugi szablon.jpg'
            },
        ]
    },
    {
        id: 2,
        parentId: 1,
        level: 1,
        client: 'Stefan',
        openClient: 'true',
        stageName: 'pierwszy zagniezdzony',
        tasks: [
            {
                id: 1,
                name: 'Wizja',
                notes: lorem,
                miniNote: '01.11.1992',
                folders: [
                    {
                        id: 300,
                        isOpen: false,
                        folderName: 'blabla',
                        files: [
                            {
                                id: 6,
                                url: 'jakis url',
                                name: 'blabla.pdf'
                            },
                            {
                                id: 7,
                                url: 'jakis url',
                                name: 'bleble.xlsx'
                            },
                        ]
                    },
                ],
                files: '',
                table:
                    {
                    title: 'Tytuł',
                    type: '',
                    head: [
                        {id: 1, label: 'Naglowek'},
                        {id: 2, label: 'Naglowek'},
                        {id: 3, label: 'Naglowek'},
                        {id: 4, label: 'Naglowek'},
                        {id: 5, label: 'Naglowek'},
                        {id: 6, label: 'Naglowek'},
                    ],
                    body: [
                        {
                            id: 1,
                            title: 'Przykładowa notatka',
                            prevFiles: [
                                {
                                    id: 6,
                                    url: 'jakis url',
                                    name: 'blabla.pdf'
                                },
                                {
                                    id: 7,
                                    url: 'jakis url',
                                    name: 'bleble.xlsx'
                                },
                            ],
                            all_files: false,
                            send_date: undefined,
                            receive_date: undefined,
                            post_files: [
                                {
                                    id: 6,
                                    url: 'jakis url',
                                    name: 'plik.txt'
                                },
                                {
                                    id: 7,
                                    url: 'jakis url',
                                    name: 'zdjecie.jpg'
                                },
                            ],
                            status: AgreementsStatus.AGREE,
                            is_second_table: false,
                            second_files: [
                                {
                                    id: 6,
                                    url: 'jakis url',
                                    name: 'blabla.pdf'
                                },
                            ],
                            secondData: undefined,
                            isAllSecondFiles: false,
                            secondStatus: AgreementsStatus.UNDEFINED
                        },
                    ]
                },
                status: CellsColor.Empty
            },
            {
                id: 2,
                name: lorem2,
                notes: 'fafsfafssaf',
                folders: [],
                files: '',
                table: '',
            },
        ],
    },
    {
        id: 3,
        parentId: 2,
        level: 2,
        stageName: 'duzy zagniezdzony',
        tasks: [
            {
                id: 1,
                name: 'Wizja',
                notes: lorem,
                miniNote: '',
                folders: [],
                files: '',
                table: '',
                status: CellsColor.Empty
            },
            {
                id: 2,
                name: lorem2,
                notes: 'fafsfafssaf',
                folders: [],
                files: '',
                table: '',
            },
        ],
    }
    ]
//     , {
//         id: 7,
//         parentId: 3,
//         level: 3,
//         stageName: 'trzeci zagniezdzony',
//         tasks: [
//             {
//                 id: 1,
//                 name: 'Powinno byc id 7',
//                 notes: lorem,
//                 miniNote: 'mini notatka',
//                 folders: [],
//                 files: '',
//                 table: '',
//                 status: CellsColor.Empty
//             },
//             {
//                 id: 2,
//                 name: lorem2,
//                 notes: 'fafsfafssaf',
//                 folders: [],
//                 files: '',
//                 table: '',
//             },
//         ],
//     },
//     {
//         id: 4,
//         parentId: 1,
//         level: 1,
//         stageName: 'pierwszy zagniezdzony',
//         tasks: [
//             {
//                 id: 1,
//                 name: 'Wizja',
//                 notes: lorem,
//                 miniNote: 'mini notatka',
//                 folders: [],
//                 files: '',
//                 table: '',
//                 status: CellsColor.Empty
//             },
//             {
//                 id: 2,
//                 name: lorem2,
//                 notes: 'fafsfafssaf',
//                 folders: [],
//                 files: '',
//                 table: '',
//             },
//         ],
//     },
//
//     {
//         id: 8,
//         stageName: Countries.TCZEW,
//         files: [
//             {
//                 id: 3,
//                 url: 'jakis url',
//                 name: 'Pierwszy szablon'
//             },
//             {
//                 id: 4,
//                 url: 'jakis url',
//                 name: 'drugi szablon'
//             },
//         ],
//     },
//     {
//         id: 9,
//         parentId: 8,
//         level: 1,
//         stageName: 'pierwszy zagniezdzony',
//         tasks: [
//             {
//                 id: 1,
//                 name: 'Wizja',
//                 notes: lorem,
//                 miniNote: '01.11.1992',
//                 folders: [],
//                 files: '',
//                 table: '',
//                 status: CellsColor.ToCheck
//             },
//             {
//                 id: 2,
//                 name: lorem2,
//                 notes: 'fafsfafssaf',
//                 folders: [],
//                 files: '',
//                 table: '',
//             },
//         ],
//     },
//     {
//         id: 10,
//         parentId: 8,
//         level: 2,
//         stageName: 'duzy zagniezdzony',
//         tasks: [
//             {
//                 id: 1,
//                 name: 'Wizja',
//                 notes: lorem,
//                 miniNote: '',
//                 folders: [],
//                 files: '',
//                 table: '',
//                 status: CellsColor.Empty
//             },
//             {
//                 id: 2,
//                 name: lorem2,
//                 notes: 'fafsfafssaf',
//                 folders: [],
//                 files: '',
//                 table: '',
//             },
//         ],
//     }, {
//         id: 11,
//         parentId: 8,
//         level: 3,
//         stageName: 'trzeci zagniezdzony',
//         tasks: [
//             {
//                 id: 1,
//                 name: 'Powinno byc id 7',
//                 notes: lorem,
//                 miniNote: 'mini notatka',
//                 folders: [],
//                 files: '',
//                 table: '',
//                 status: CellsColor.ToDeploy
//             },
//             {
//                 id: 2,
//                 name: lorem2,
//                 notes: 'fafsfafssaf',
//                 folders: [],
//                 files: '',
//                 table: '',
//             },
//         ],
//     },
//     {
//         id: 12,
//         parentId: 8,
//         level: 1,
//         stageName: 'pierwszy zagniezdzony',
//         tasks: [
//             {
//                 id: 1,
//                 name: 'Wizja',
//                 notes: lorem,
//                 miniNote: 'mini notatka',
//                 folders: [],
//                 files: '',
//                 table: '',
//                 status: CellsColor.Finish
//             },
//             {
//                 id: 2,
//                 name: lorem2,
//                 notes: 'fafsfafssaf',
//                 folders: [],
//                 table: '',
//             },
//         ],
//     },
// ];
//
//
