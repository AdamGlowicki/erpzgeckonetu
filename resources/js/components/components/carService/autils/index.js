export const getAlertsByCarId = (carId, alerts) => (
    alerts.filter(item => item.automobile_id === carId)
);
