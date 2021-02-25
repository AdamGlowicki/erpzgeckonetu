<?php

namespace App\Console\Commands;

use App\CarsItem;
use Illuminate\Console\Command;
use App\WarehousesStock;

class StockCheckCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stock:check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check warehouses stocks for quantity vs SN/MAC';

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
        $result = WarehousesStock::with('item', 'element')->whereHas('item', function($query) {
            $query->where('has_data', 1);
        })->get();

        foreach($result as $stock) {
            if($stock->quantity !== count($stock->element)) {
                echo 'warehouses_stocks|'. $stock->id .'|'. $stock->item->id .'|'. $stock->item->model_name .'|'. $stock->quantity .'|'. count($stock->element) . "\n";
            }
        }

        $result = CarsItem::with('item', 'element')->whereHas('item', function($query) {
            $query->where('has_data', 1);
        })->get();

        foreach($result as $stock) {
            if($stock->quantity !== count($stock->element)) {
                echo 'cars_items|'. $stock->id .'|'. $stock->item->id .'|'. $stock->item->model_name .'|'. $stock->quantity .'|'. count($stock->element) . "\n";
            }
        }
    }
}
