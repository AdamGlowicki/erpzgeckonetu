<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Rap2hpoutre\FastExcel\FastExcel;

class ItemListCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'items:list';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate xlsx with item list';

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
        $result = \App\Item::with([
            'itemsCategory',
            'itemsManufacturer',
            'unit',
        ])
        ->get();

        $rows = [];

        $bar = $this->output->createProgressBar(count($result));
        $bar->start();

        foreach($result as $item) {
            $bar->advance();

            $rows[] = [
                'id' => $item->id,
                'hidden' => $item->hidden,
                'has_data' => $item->has_data,
                'category' => $item->itemsCategory->name,
                'manufacturer' => $item->itemsManufacturer->name,
                'name' => $item->model_name,
                'unit' => $item->unit->short_name,
            ];
        }

        $bar->finish();

        $collection = collect($rows);

        (new FastExcel($collection))->export('storage/app/items_list.xlsx');
    }
}
