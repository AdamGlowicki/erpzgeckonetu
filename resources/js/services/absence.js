class Absence {
    construct() {
        this.resource = 'absence';
    }

    fillCalendar(month) {
        get('user/all/active', function(response) {
            moment.locale('pl');

            moment.updateLocale('pl', {
                weekdaysShort : ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"],
            });

            let current = moment();

            let lastMonth = current.clone().add(-1, 'months');
            let nextMonth = current.clone().add(1, 'months');

            $('.last-month').text(lastMonth.format('MMMM'));
            $('.next-month').text(nextMonth.format('MMMM'));

            console.log(current.format('MMMM'));

            console.log(lastMonth.format('MMMM'));
            console.log(nextMonth.format('MMMM'));

            console.log(current.daysInMonth());

            let firstDay = current.startOf('month');
            let days = current.daysInMonth();

            for(let i=1; i<=days; i++) {
                let day = firstDay.clone().add(i-1, 'days');

                console.log(day);

                let col = $(`<th class="absense-calendar-header">
                    <div>
                        <div style="padding-bottom: 0px;">${day.format('DD')}</div>
                        ${day.format('ddd')}
                    </div>
                </th>`);

                if(day.weekday() === 6) {
                    $(col).addClass('absence-schedule-free-day');
                }

                if(day.format('DD') === moment().format('DD')) {
                    $(col).addClass('absence-schedule-current-day');
                }

                $('.table-calendar > thead > tr').append(col);

                day.add(1, 'days');
            }

            $.each(response, function(k,v) {
                let row = $(`<tr>
                    <th class="th-first">
                        <div class="employee-container">
                            <a class="employeeInfoPopover" target="_blank" data-url="/popover-data/1?template=absenceSchedule" data-placement="right" data-id="1" href="/employee/profil/1/" data-content="<i class=&quot;fa fa-spinner fa-spin p-t-10 p-b-10 p-l-10 p-r-10&quot;></i>">
                                ${v.name}
                            </a>
                        </div>
                    </th>
                </tr>`);

                for(let i=1;i<=days; i++) {
                    let day = firstDay.clone().add(i-1, 'days');

                    let el = $(`<td class="">
                        <span>${i}</span>
                    </td>`);

                    if(day.weekday() === 6 || day.weekday() === 5) {
                        $(el).addClass('free-day');
                    }

                    $(row).append(el);
                }

                $(`.table-calendar > tbody`).append(row);
            });
        }, function(error) {

        });
    }
}

let absence = new Absence;
absence.fillCalendar();

$(document).ready(function() {
    $('.easy-pie-1').easyPieChart({
        lineWidth:4,
        barColor:'#8e49a3',
        scaleColor:false,
        size: 40,
    });

    $('.easy-pie-4').easyPieChart({
        lineWidth:4,
        barColor:'#3da6a1',
        scaleColor:false,
        size: 40,
    });
})
