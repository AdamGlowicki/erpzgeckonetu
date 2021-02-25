<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\App;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [

    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('events:add')->monthlyOn(1, '00:00');
        $schedule->command('carAlert:check')->dailyAt('04:00');

        if(App::environment('production')) {
            $schedule->command('client:update')->dailyAt('03:00');
            $schedule->command('netstork:get')->weeklyOn(5, '6:00');
            $schedule->command('leads:get')->weeklyOn(5, '6:00');
        }
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
