<?php

namespace App\Console\Commands;

use App\WarehousesStock;
use Illuminate\Console\Command;
use Rap2hpoutre\FastExcel\FastExcel;

class WarehousesStockCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'warehouse:export {id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Export warehouse stock to xlsx';

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
        $result = WarehousesStock::with(['item', 'item.avgPrice', 'warehouse', 'item.itemsManufacturer', 'item.itemsCategory', 'item.unit', 'element'])
            ->select('warehouses_stocks.*')
            ->leftJoin('items', 'items.id', '=', 'warehouses_stocks.item_id')
            ->leftJoin('items_categories', 'items_categories.id', '=', 'items.items_category_id')
            ->where('warehouse_id', $this->argument('id'))
            ->where('quantity', '>', 0)
            ->orderBy('items_categories.name', 'asc')
            ->orderBy('items.model_name', 'asc')
            ->get();

        $collection = collect();

        foreach($result as $stock) {
            $collection[] = [
                'id' => $stock->item->id,
                'model_name' => $stock->item->model_name,
                'quantity' => $stock->quantity,
                'avg_price' => isset($stock->item->avgPrice[0]) ? $stock->item->avgPrice[0]->avg : '',
            ];
        }

        (new FastExcel($collection))->export('storage/app/warehouse_stock_'. $this->argument('id') .'.xlsx');
    }
}
