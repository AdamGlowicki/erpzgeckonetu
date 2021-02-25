<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;

class EventsAddCommand extends Command
{
    public $start;
    public $firstDay;
    public $lastDay;
    public $unusedDays;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'events:add';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Auto add scheduled events for employees';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();

        $this->start = new Carbon('first day of next month');
        $this->lastDay = new Carbon('last day of next month');
        $this->firstDay = new Carbon('first day of next month');
        $this->unusedDays = [];
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $users = [
            'piotr.laskowski@geckonet.pl',
            'pawel.laskowski@geckonet.pl',
            'karol.gawryjalek@geckonet.pl',
            'bartosz.oskroba@geckonet.pl',
            'patryk.wolaziewicz@geckonet.pl',
            'szymon.rozanski@geckonet.pl',
            'lukasz.behrendt@geckonet.pl',
            'patrick.urban@geckonet.pl',
            'joanna.znaniecka@geckonet.pl',
            'tomasz.mglosiek@geckonet.pl',
        ];

        $this->start->setHour(0)->setMinute(0);

        while(!$this->isThatDateWorkingDay($this->firstDay->format('Y-m-d'))) {
            $this->firstDay->addDays(1);
        }

        while(!$this->isThatDateWorkingDay($this->lastDay->format('Y-m-d'))) {
            $this->lastDay->addDays(-1);
        }

        \App\User::whereIn('username', $users)->each(function ($user) {
            foreach($this->unusedDays as $key => $day) {
                if($this->check($user, $day) > 0) {
                    continue;
                } else {
                    $this->start = $day;

                    unset($this->unusedDays[$key]);

                    break;
                }
            }

            while ($this->check($user, $this->start) > 0) {
                $this->unusedDays[$this->start->format('Y-m-d')] = $this->start->copy();

                $this->start->addDays(1);
            }

            \App\Event::create([
                'user_created_id' => 2,
                'user_id' => $user->id,
                'client_id' => null,
                'investment_id' => null,
                'start' => $this->start->copy()->setHour(8)->setMinutes(00)->setSeconds(0)->format('Y-m-d H:i:s'),
                'end' => $this->start->copy()->setHour(9)->setMinutes(30)->setSeconds(0)->format('Y-m-d H:i:s'),
                'title' => 'Mycie i sprzątanie auta',
                'description' => 'WYMAGANY RAPORT PO SPRZĄTANIU!',
                'status' => 0,
                'type' => 9,
                'priority' => 2,
                'all_day' => false,
            ]);

            $this->start->addDays(1);

            if($user->hasRole('Technik')) {
                \App\Event::create([
                    'user_created_id' => 2,
                    'user_id' => $user->id,
                    'client_id' => null,
                    'investment_id' => null,
                    'start' => $this->lastDay->copy()->setHour(15)->setMinutes(45)->setSeconds(0)->format('Y-m-d H:i:s'),
                    'end' => $this->lastDay->copy()->setHour(16)->setMinutes(00)->setSeconds(0)->format('Y-m-d H:i:s'),
                    'title' => 'Zdanie umów do biura',
                    'description' => '',
                    'status' => 0,
                    'type' => 9,
                    'priority' => 2,
                    'all_day' => false,
                ]);

                \App\Event::create([
                    'user_created_id' => 2,
                    'user_id' => $user->id,
                    'client_id' => null,
                    'investment_id' => null,
                    'start' => $this->firstDay->copy()->setHour(15)->setMinutes(45)->setSeconds(0)->format('Y-m-d H:i:s'),
                    'end' => $this->firstDay->copy()->setHour(16)->setMinutes(00)->setSeconds(0)->format('Y-m-d H:i:s'),
                    'title' => 'Pobranie umów z biura',
                    'description' => '',
                    'status' => 0,
                    'type' => 9,
                    'priority' => 2,
                    'all_day' => false,
                ]);
            }
        });
    }

    public function check($user, $date) {
        $start = $date->copy()->setHour(8);
        $end = $start->addMinutes(90);

        $check = \App\Event::where(function($query) use($start, $end) {
                $query->where('start', '<=', $start->format('Y-m-d H:i:s'))
                    ->where('end', '>=', $end->format('Y-m-d H:i:s'));
            })
            ->where('user_id', $user->id)
            ->count();

        if($check === 0) {
            if(!$this->isThatDateWorkingDay($start->format('Y-m-d'))) {
                return 1;
            }

            return $check;
        }

        return $check;
    }

    /**
     * Funkcja sprawdza czy podana data jest dniem pracującym (TRUE) lub święto/sobota/niedziele (FALSE)
     *
     * @param string $date Data w formacie Y-m-d (np. 2015-08-26)
     * @return boolean
     */
    public function isThatDateWorkingDay($date) {
        $time = strtotime($date);
        $dayOfWeek = (int) date('w', $time);
        $year = (int) date('Y', $time);

        #sprawdzenie czy to nie weekend
        if($dayOfWeek==6 || $dayOfWeek==0) {
            return false;
        }

        #lista swiat stalych
        $holiday=array('01-01', '01-06','05-01','05-03','08-15','11-01','11-11','12-25','12-26');

        #dodanie listy swiat ruchomych
        #wialkanoc
        $easter = date('m-d', easter_date( $year ));
        #poniedzialek wielkanocny
        $easterSec = date('m-d', strtotime('+1 day', strtotime( $year . '-' . $easter) ));
        #boze cialo
        $cc = date('m-d', strtotime('+60 days', strtotime( $year . '-' . $easter) ));
        #Zesłanie Ducha Świętego
        $p = date('m-d', strtotime('+49 days', strtotime( $year . '-' . $easter) ));

        $holiday[] = $easter;
        $holiday[] = $easterSec;
        $holiday[] = $cc;
        $holiday[] = $p;

        $md = date('m-d',strtotime($date));

        if(in_array($md, $holiday))  {
            return false;
        }

        return true;
    }
}
