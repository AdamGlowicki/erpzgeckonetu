<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Spatie\GoogleCalendar\Event as GoogleCalendar;
use Config;
use App\Event as AppEvent;
use App\EventsReminder as AppEventsReminder;

class GoogleCalendarCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'calendar:import';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Imports events from Google Calendar';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $calendars = [
            'phugeckonet@gmail.com', // nieprzypisane
            'kh9c97jd3bsfjvl5mqnikgunho@group.calendar.google.com', // B. Oskroba
            'rj8tv8p7mhl03ih3e2b8jcvoa8@group.calendar.google.com', // D. Górski
            't7fe5qras1omiao4677s3elfu0@group.calendar.google.com', // P. Wołąziewicz
            'hjrihs8bra1is3tdoq2es37gps@group.calendar.google.com', // Paw. Laskowski
            'tmpm9emav6crg1923nhd0195r4@group.calendar.google.com', // Pio. Laskowski
            '0sha46b8divr7jmijqpqv9ptfg@group.calendar.google.com', // J. Pestka
            'bfs1hmhmpvq65n8921emngv6q4@group.calendar.google.com', // K. Smeja
            'fj0kr3raiss87q4o261d7l50io@group.calendar.google.com', // K. Gawryjałek
            'pfm6er0bsff9fs95kr43684674@group.calendar.google.com', // M. Leśniak
            'bjql2gp0f8bfmdpcn9s0ljgatk@group.calendar.google.com', // P. Urban
            'qek6s411akodo9vp76gjh8dc2o@group.calendar.google.com', // P. Piasecki
            'knv57napie1vm1u8mit4bq5pgs@group.calendar.google.com', // P. Pepliński
            'mdkd3f4rviqnmbjitpetj10hhc@group.calendar.google.com', // S. Rozanski
        ];

        switch(Config::get('app.env')) {
            case 'local':
                $users = [
                    'phugeckonet@gmail.com' => 1, // nieprzypisane
                    'kh9c97jd3bsfjvl5mqnikgunho@group.calendar.google.com' => 2, // B. Oskroba
                    'rj8tv8p7mhl03ih3e2b8jcvoa8@group.calendar.google.com' => 3, // D. Górski
                    't7fe5qras1omiao4677s3elfu0@group.calendar.google.com' => 4, // P. Wołąziewicz
                    'hjrihs8bra1is3tdoq2es37gps@group.calendar.google.com' => 1, // Paw. Laskowski
                    'tmpm9emav6crg1923nhd0195r4@group.calendar.google.com' => 2, // Pio. Laskowski
                    '0sha46b8divr7jmijqpqv9ptfg@group.calendar.google.com' => 3, // J. Pestka
                    'fj0kr3raiss87q4o261d7l50io@group.calendar.google.com' => 4, // K. Gawryjałek
                    'pfm6er0bsff9fs95kr43684674@group.calendar.google.com' => 1, // M. Leśniak
                    'bjql2gp0f8bfmdpcn9s0ljgatk@group.calendar.google.com' => 2, // P. Urban
                    'qek6s411akodo9vp76gjh8dc2o@group.calendar.google.com' => 3, // P. Piasecki
                    'knv57napie1vm1u8mit4bq5pgs@group.calendar.google.com' => 4, // P. Pepliński
                    'geckonet38@gmail.com' => 1, // P. Kuriata
                    'geckonet16@gmail.com' => 2, // A. Śliwiński
                    'geckonet66@gmail.com' => 3, // G. Doliński
                    'szymonroza97@gmail.com' => 4, // S. Rozanski
                    'sebastian.geckonet@gmail.com' => 1, // S. Przybylski
                    'mateusz.geckonet@gmail.com' => 2, // M. Komorowski
                    'bfs1hmhmpvq65n8921emngv6q4@group.calendar.google.com' => 3, // K. Smeja
                    'fiv3d1@gmail.com' => 4, // K. gawryj
                    'mdkd3f4rviqnmbjitpetj10hhc@group.calendar.google.com' => 1, // S. Roz
                ];

                break;
            case 'production':
                $users = [
                    'phugeckonet@gmail.com' => 1, // nieprzypisane
                    'kh9c97jd3bsfjvl5mqnikgunho@group.calendar.google.com' => 45, // B. Oskroba
                    'rj8tv8p7mhl03ih3e2b8jcvoa8@group.calendar.google.com' => 42, // D. Górski
                    't7fe5qras1omiao4677s3elfu0@group.calendar.google.com' => 46, // P. Wołąziewicz
                    'hjrihs8bra1is3tdoq2es37gps@group.calendar.google.com' => 43, // Paw. Laskowski
                    'tmpm9emav6crg1923nhd0195r4@group.calendar.google.com' => 41, // Pio. Laskowski
                    '0sha46b8divr7jmijqpqv9ptfg@group.calendar.google.com' => 50, // J. Pestka
                    'bfs1hmhmpvq65n8921emngv6q4@group.calendar.google.com' => 1, // K. Smeja
                    'fj0kr3raiss87q4o261d7l50io@group.calendar.google.com' => 44, // K. Gawryjałek
                    'pfm6er0bsff9fs95kr43684674@group.calendar.google.com' => 52, // M. Leśniak
                    'bjql2gp0f8bfmdpcn9s0ljgatk@group.calendar.google.com' => 49, // P. Urban
                    'qek6s411akodo9vp76gjh8dc2o@group.calendar.google.com' => 1, // P. Piasecki
                    'knv57napie1vm1u8mit4bq5pgs@group.calendar.google.com' => 4, // P. Pepliński
                    'geckonet38@gmail.com' => 3, // P. Kuriata
                    'geckonet16@gmail.com' => 53, // A. Śliwiński
                    'geckonet66@gmail.com' => 47, // G. Doliński
                    'mdkd3f4rviqnmbjitpetj10hhc@group.calendar.google.com' => 65, // S. Różański
                    'sebastian.geckonet@gmail.com' => 64, // S. Przybylski
                    'mateusz.geckonet@gmail.com' => 63, // M. Komorowski
                    'fiv3d1@gmail.com' => 44, // K. gawryj
                ];

                break;
        }

        foreach($calendars as $calendar) {
            Config::set('google-calendar.calendar_id', $calendar);

            $events = GoogleCalendar::get(
                Carbon::create(2012, 1, 1, 0, 0, 0),
                Carbon::now()->addYear(3),
                [
                    'maxResults' => 2500,
                ],
                $calendar);

            foreach($events as $event) {
                var_dump(" ------- calendar: ". $calendar ." ------");
                var_dump($event->startDateTime ? $event->startDateTime->toIso8601String() : $event->startDate->toIso8601String());
                var_dump($event->endDateTime ? $event->endDateTime->toIso8601String() : $event->endDate->toIso8601String());
                var_dump($event->name);
                var_dump($event->description);
                var_dump($event->creator->email);
                var_dump($event->organizer->email);
                var_dump($event->created);
                var_dump($event->updated);

                var_dump($event->reminders);

                $result = AppEvent::create([
                    'user_created_id' => $users[$event->creator->email],
                    'user_id' => $users[$calendar],
                    'client_id' => null,
                    'investment_id' => null,
                    'start' => $event->startDateTime ? $event->startDateTime->toIso8601String() : $event->startDate->toIso8601String(),
                    'end' => $event->endDateTime ? $event->endDateTime->toIso8601String() : $event->endDate->toIso8601String(),
                    'title' => $event->name ? strip_tags($event->name) : '',
                    'description' => str_replace('&nbsp;', "\n", strip_tags($event->description)),
                    'phone' => null,
                    'address' => null,
                    'status' => 0,
                    'priority' => 1,
                    'created_at' => $event->created,
                    'updated_at' => $event->updated,
                ]);

                /* AppEventsReminder::create([
                    'event_id' => $result->id,
                    'time' => 900,
                ]); */
            }
        }
    }
}
