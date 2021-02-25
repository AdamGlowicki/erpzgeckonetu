<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Excel;

class ImportRouterListCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'routers:import';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import router list from .csv file';

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
        $file = file(storage_path('app/routers.csv'));

        $input = array_map('str_getcsv', $file);

        foreach($input as $line) {
            $row = str_getcsv($line[0], ';');

            
        }
    }
}
