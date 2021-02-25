import {Countries} from './Countries';

export const investmentsTemplate = () => {
    const arr = [
        {id: 1, label: Countries.DEFAULT, value: Countries.DEFAULT},
        {id: 2, label: Countries.TCZEW, value: Countries.TCZEW},
        {id: 3, label: Countries.SWIECIE, value: Countries.SWIECIE},
        {id: 4, label: Countries.STAROGARD_GDANSKI, value: Countries.STAROGARD_GDANSKI},
        {id: 5, label: Countries.INOWROCLAW, value: Countries.INOWROCLAW},
        {id: 6, label: Countries.GRUDZIADZ, value: Countries.GRUDZIADZ},
        {id: 7, label: Countries.GDANSK, value: Countries.GDANSK},
        {id: 8, label: Countries.KWIDZYN, value: Countries.KWIDZYN},
    ]

    return arr.sort((a, b) => a.value.localeCompare(b.value))
}
