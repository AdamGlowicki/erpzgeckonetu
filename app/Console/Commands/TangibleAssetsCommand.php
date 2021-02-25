<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Rap2hpoutre\FastExcel\FastExcel;

class TangibleAssetsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'assets:get';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate tangible assets from PZ using investments';

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
        // update all investments_items and set assets quantity
        $result = \App\InvestmentsItem::all();

        foreach($result as $item) {
            $item->update([
                'quantity_assets' => $item->quantity,
            ]);
        }

        // get all invoices items
        $itemsInvoices = \App\WarehousesInItem::with(['warehousesIn', 'item'])
            ->orderBy('created_at', 'ASC')
            ->get();

        $itemsArray = collect();

        foreach($itemsInvoices as $item) {
            $quantity = $item->quantity;

            $found = \App\InvestmentsItem::with(['investment', 'item'])
                ->where('item_id', $item->item_id)
                ->whereHas('investment', function($query) use($item) {
                    $query->where('date_end', '>', $item->warehousesIn->invoice_date);
                })
                ->where('quantity_assets', '>', 0)
                ->orderByJoin('investment.id', 'DESC')
                ->get();

            if(!$found) {
                continue;
            }

            foreach($found as $fitem) {
                if($fitem->quantity_assets >= $quantity) {
                    $itemsArray[] = [
                        'invoice_name' => $item->warehousesIn->invoice_name,
                        'invoice_date' => $item->warehousesIn->invoice_date,
                        'document_name' => $item->warehousesIn->document_name,
                        'investment_name' => $fitem->investment->name,
                        'investment_end_date' => $fitem->investment->date_end,
                        'model_name' => $item->item->model_name,
                        'item_id' => $item->item_id,
                        'price_notax' => $item->price_notax,
                        'quantity' => $quantity,
                    ];

                    echo $item->warehousesIn->invoice_name .
                        ' | '. $item->warehousesIn->invoice_date .
                        ' | '. $item->warehousesIn->document_name .
                        ' | '. $fitem->investment->name .
                        ' | '. $fitem->investment->date_end .
                        ' | '. $item->item->model_name .
                        ' | '. $item->item_id .
                        ' | '. $item->price_notax .
                        ' | '. $quantity
                        . PHP_EOL;

                    $fitem->decrement('quantity_assets', $quantity);

                    break;
                } else {
                    $quantity = $quantity - $fitem->quantity_assets;

                    $itemsArray[] = [
                        'invoice_name' => $item->warehousesIn->invoice_name,
                        'invoice_date' => $item->warehousesIn->invoice_date,
                        'document_name' => $item->warehousesIn->document_name,
                        'investment_name' => $fitem->investment->name,
                        'investment_end_date' => $fitem->investment->date_end,
                        'model_name' => $item->item->model_name,
                        'item_id' => $item->item_id,
                        'price_notax' => $item->price_notax,
                        'quantity' => $fitem->quantity_assets,
                    ];

                    echo $item->warehousesIn->invoice_name .
                        ' | '. $item->warehousesIn->invoice_date .
                        ' | '. $item->warehousesIn->document_name .
                        ' | '. $fitem->investment->name .
                        ' | '. $fitem->investment->date_end,
                        ' | '. $item->item->model_name .
                        ' | '. $item->item_id .
                        ' | '. $item->price_notax .
                        ' | '. $fitem->quantity_assets
                        . PHP_EOL;

                    $fitem->decrement('quantity_assets', $fitem->quantity_assets);

                    continue;
                }
            }
        }

        $collection = collect($itemsArray);

        (new FastExcel($collection))->export('storage/app/assets.xlsx');
    }
}
