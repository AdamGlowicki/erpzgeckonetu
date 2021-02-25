import {TURN_OFF_ALERT, TURN_ON_ALERT} from "./type";

export const turnOnAlert = payload => ({
    type: TURN_ON_ALERT,
    payload,
});

export const turnOffAlert = payload => ({
    type: TURN_OFF_ALERT,
    payload,
})
