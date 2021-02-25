class Wfm {
    constructor() {
        this.data = {};
        this.data.resource = 'users_schedule';
        this.data.dates = [];
    }

    get resource() {
        return this.data.resource;
    }

    get dates() {
        return this.data.dates;
    }

    disable(date) {
        $(`[data-day="${date}"]`, document).addClass('disabled');
    }

    addDate(date) {
        this.dates.push(date);

        console.log(this.data.dates);
    }

    removeDate(date) {
        this.data.dates = this.dates.filter(item => item !== date);

        console.log(this.data.dates);
    }

    store() {
        let resource = this.resource;

        let data = {
            dates: this.dates,
        };

        post(resource, data, function(response) {
            notification.success('Dyspozycyjność dyżurów została zapisana');
        }, function(response) {
            switch(response.status) {
                case 422:
                    notification.error('Ilość wybranych dni nie jest wystarczająca do uzyskania dyspozycyjności w danym miesiącu');

                    break;
            }
        });
    }
}

let wfm = new Wfm();

$(document).ready(function() {
    /* let current = moment().add(1, 'months');
    let days = current.daysInMonth();

    let firstDay = current.startOf('month');

    for(let i=1; i<=days; i++) {
        let day = firstDay.clone().add(i - 1, 'days');

        let row = $(`<div class="row mb-3">
            <div class="col ml-1 mr-1">
                <div class="form-check mt-0 mb-2 mt-1 mb-1">
                    <label class="form-check-label">
                      <input class="form-check-input" type="checkbox" value="" checked="">
                      <span class="form-check-sign">
                        <span class="check">${day.format('D MMMM YYYY')} (${day.format('dddd')})</span>
                      </span>
                    </label>
                  </div>
                    <div class="form-group ml-2 mr-2">
                        <input type="text" class="js-range-slider" name="my_range" value="" />
                    </div>
            </div>
        </div>`);

        if(day.weekday() === 5 || day.weekday() === 6) {
            $(row).addClass('alert-secondary');
        }

        $(`[data-resource="wfm"]`, document).append(row);
    }

    $('.js-range-slider', document).ionRangeSlider({
        skin: "round",
        grid: true,
        type: 'double',
        min: moment("0000", "hhmm").valueOf(),
        max: moment("0000", "hhmm").add(1, 'days').valueOf(),
        from: moment("0800", "hhmm").valueOf(),
        to: moment("1600", "hhmm").valueOf(),
        force_edges: true,
        drag_interval: true,
        step: 1800000,
        min_interval: 7200000,
        prettify: function (num) {
            return moment(num).format('HH:mm');
        }
    }); */

    window['moment-range'].extendMoment(moment);

    moment.locale('pl');

    $('[data-resource="wfm"]');

    let today = new Date();
    let currentMonth = today.getMonth() + 1;
    let currentYear = today.getFullYear();

    let months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];

    let monthAndYear = document.getElementById("monthAndYear");

    get('users_schedule', function(response) {
        showCalendar(currentMonth, currentYear, response);
    });

    function showCalendar(month, year, response) {
        let startDate = moment([year, month])

        if(Object.keys(response.dates).length > 0) {
            if(moment().isAfter([year, month-1, 26])) {
                $('button[data-type="add"]', document).prop('disabled', true);
            }
        }

        response.dates.forEach(day => {
            wfm.addDate(day.date);
        });

        let firstDay = moment(startDate).startOf('month');
        let endDay = moment(startDate).endOf('month');

        let monthRange = moment.range(firstDay, endDay);

        const weeks = [];
        const days = Array.from(monthRange.by('day'));

        days.forEach(it => {
            if (!weeks.includes(it.week())) {
                weeks.push(it.week());
            }
        })

        const calendar = [];

        weeks.forEach(week => {
            const firstWeekDay = moment([year, month]).week(week).day(1);
            const lastWeekDay = moment([year, month]).week(week).day(7);
            const weekRange = moment.range(firstWeekDay, lastWeekDay);
            calendar.push(Array.from(weekRange.by('day')));
        });

        let tbl = $('.calendar-body');

        calendar.forEach(week => {
            let row = $(`<tr></tr>`);

            if(week[week.length - 1].month() !== month) {
                return true;
            }

            week.forEach(day => {
                let dayStr = day.format('YYYY-MM-DD');

                let col = $(`<td data-day="${dayStr}" class="clickable">${day.format('DD')} <span class="d-block"><small>${day.weekday() < 5 ? '16-22' : '8-22'}</small></span></td>`);

                if(day.month() !== month) {
                    $(col).addClass('other-day');
                }

                if(day.weekday() >= 5) {
                    $(col).addClass('free-day');
                }

                if(response.dates.some(item => item.date === dayStr)) {
                    $(col).addClass('bg-primary day-selected');
                }

                $(row).append(col);
            });

            $(tbl).append(row);
        });

        response.limits.forEach(day => {
            if(day.quantity >= 6) {
                wfm.disable(day.date);
            }
        })

        monthAndYear.innerHTML = months[month] + " " + year;
    }

    $('#calendar', document).on('click', '.clickable', function() {
        $(this).toggleClass('bg-primary day-selected');

        let date = $(this).data('day');

        if($(this).hasClass('day-selected')) {
            wfm.addDate(date);
        } else {
            wfm.removeDate(date);
        }
    });

    $(document).on('click', '[data-type="add"]', function() {
        wfm.store();
    });
});
