<?php

namespace App\Console\Commands;

use App\Navifleet;
use Illuminate\Console\Command;

class CheckAlertCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'carAlert:check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check car if generate alert';

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
        $navifleet = new Navifleet();
        $navifleet->check();
    }
}
