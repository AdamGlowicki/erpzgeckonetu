<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Warehouse;

class WarehouseCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'warehouse:clean {id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Warehouse clean';

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
        $result = Warehouse::find($this->argument('id'));

        foreach($result->warehousesStock as $item) {
            foreach($item->element as $element) {
                $element->delete();
            }

            $item->delete();
        }
    }
}
