import {AgreementsStatus} from './agreementsStatus';

export const rowConst = (table_id) => ({
    LINE_CABLE: {title: null, prev_files: [], send_date: undefined, status: AgreementsStatus.UNDEFINED, table_id},
    OTHER: {title: null, all_files: false, send_date: null, receive_date: null, status: AgreementsStatus.UNDEFINED, is_second_table: false, second_date: null, is_all_second_files: false, second_status: AgreementsStatus.UNDEFINED, table_id}
});
