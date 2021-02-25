<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Rap2hpoutre\FastExcel\FastExcel;

class ItemStockCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'items:stock {warehouse}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate xlsx with item list with stock in specified warehouse';

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
        $result = \App\WarehousesStock::with(['item', 'item.itemsManufacturer', 'item.itemsCategory', 'item.unit', 'element'])
            ->select('warehouses_stocks.*')
            ->leftJoin('items', 'items.id', '=', 'warehouses_stocks.item_id')
            ->leftJoin('items_categories', 'items_categories.id', '=', 'items.items_category_id')
            ->where('warehouse_id', $this->argument('warehouse'))
            ->where('quantity', '>', 0)
            ->orderBy('items_categories.name', 'asc')
            ->orderBy('items.model_name', 'asc')
            ->get();

        $rows = [];

        $bar = $this->output->createProgressBar(count($result));
        $bar->start();

        foreach($result as $stock) {
            $bar->advance();

            $rows[] = [
                'id' => $stock->item->id,
                'hidden' => $stock->item->hidden,
                'has_data' => $stock->item->has_data,
                'category' => $stock->item->itemsCategory->name,
                'manufacturer' => $stock->item->itemsManufacturer->name,
                'name' => $stock->item->model_name,
                'unit' => $stock->item->unit->short_name,
                'quantity' => $stock->quantity,
                'sn' => '',
                'mac' => '',
            ];

            if($stock->item->has_data) {
                foreach($stock->element as $element) {
                    $rows[] = [
                        'id' => '',
                        'hidden' => '',
                        'has_data' => '',
                        'category' => '',
                        'manufacturer' => '',
                        'name' => '',
                        'unit' => '',
                        'quantity' => '',
                        'sn' => $element->sn,
                        'mac' => $element->mac,
                    ];
                }
            }
        }

        $bar->finish();

        $collection = collect($rows);

        (new FastExcel($collection))->export('storage/app/items_stock_list.xlsx');
    }
}
