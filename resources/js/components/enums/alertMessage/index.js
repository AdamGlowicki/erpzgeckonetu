const printPostfix = (kms, days) => (
    kms ? `${kms} km.` : `${days} dni.`
)

export const alertMessage = (kms, days, type) => {
    const messages = [
        {id: 1, type: 'oilService', message: `Przegląd oleju za ${printPostfix(kms, days)}`},
        {id: 2, type: 'generalService', message: `Przegląd ogólny za ${printPostfix(kms, days)}`},
        {id: 3, type: 'timingGearService', message: `Wymiana rozrządu ${printPostfix(kms, days)}`},
        {id: 4, type: 'gasService', message: `Przegląd gazowy za ${printPostfix(kms, days)}`},
        {id: 5, type: 'gasHomologue', message: `Homologacja gazowa za ${printPostfix(kms, days)}`},
        {id: 6, type: 'summerChange', message: `Wymiana opon za ${printPostfix(kms, days)}`},
        {id: 7, type: 'winterChange', message: `Wymiana opon za ${printPostfix(kms, days)}`},
        {id: 8, type: 'insurance', message: `Koniec ubezpieczenia za ${printPostfix(kms, days)}`},
        {id: 9, type: 'fuelService', message: `Przegląd układu paliwowego za ${printPostfix(kms, days)}`},
    ].find(item => item.type === type)

    return messages ? messages.message : ''
}
