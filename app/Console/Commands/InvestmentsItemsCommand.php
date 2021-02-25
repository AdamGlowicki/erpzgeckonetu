<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Rap2hpoutre\FastExcel\FastExcel;

class InvestmentsItemsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'investments:items';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get all investments items to .xlsx';

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
        $result = \App\InvestmentsItem::with(['investment', 'item', 'item.avgPrice'])
            ->where('quantity', '>', 0)
            ->orderByJoin('investment.id', 'DESC')
            ->get();

        $items = collect();

        foreach($result as $fitem) {
            $items[] = [
                'investment_name' => $fitem->investment->name,
                'investment_end_date' => $fitem->investment->date_end,
                'model_name' => $fitem->item->model_name,
                'item_id' => $fitem->item_id,
                'avg_price' => isset($fitem->item->avgPrice[0]) ? $fitem->item->avgPrice[0]->avg : '',
                'quantity' => $fitem->quantity,
            ];
        }

        $collection = collect($items);

        (new FastExcel($collection))->export('storage/app/assets_inv.xlsx');
    }
}
