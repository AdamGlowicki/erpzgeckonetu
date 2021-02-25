<?php

namespace App\Console\Commands;

use App\UsersSchedulesRequest;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Mail;
use Rap2hpoutre\FastExcel\FastExcel;

class GenerateScheduleCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'schedule:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generates schedule using users disposition';

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
        $dt = Carbon::createFromDate(now()->year, now()->month);
        $dt->addMonths(1);

        $d = $dt->firstOfMonth();

        if($d->weekday() === 0) {
            $days = $d->daysUntil($d->copy()->lastOfMonth());
        } else {
            $d->modify('-1 week first Monday');
            $days = $d->daysUntil($d->copy()->addMonths(1)->modify('last Sunday'));
        }

        $result = UsersSchedulesRequest::with(['user'])
            ->where('date', '>=', $days->first()->format('Y-m-d'))
            ->where('date', '<=', $days->last()->format('Y-m-d'))
            ->orderBy('date')
            ->get();

        $array = [];

        foreach($result as $day) {
            $array[$day->date][] = $day->user->name;
        }

        $collection = collect();

        foreach($array as $day => $users) {
            $collection[] = [
                'day' => $day,
                'employee' => $users[array_rand($users)],
            ];
        }

        (new FastExcel($collection))->export('storage/app/duty_schedule.xlsx');

        if(App::environment('production')) {
            Mail::send('emails.schedule', [], function($message) {
                $message->from('erp@geckonet.pl', 'GeckoERP');
                $message->sender('erp@geckonet.pl', 'GeckoERP');
                $message->to('mateusz.brzeski@geckonet.pl', $name = null);
                $message->cc(['adam@geckonet.pl', 'radoslaw.sulkowski@geckonet.pl'], $name = null);
                // $message->bcc($address, $name = null);
                $message->replyTo('radoslaw.sulkowski@geckonet.pl', $name = null);
                $message->subject('Grafik dyżurów - '. Carbon::now()->addMonths(1)->format('Y-m'));
                // $message->priority($level);

                $message->attach(storage_path('app/duty_schedule.xlsx'));
            });
        }
    }
}
