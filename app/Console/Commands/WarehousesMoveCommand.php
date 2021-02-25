<?php

namespace App\Console\Commands;

use App\Warehouse;
use App\WarehousesStock;
use Illuminate\Console\Command;

class WarehousesMoveCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'warehouse:move {source} {dest}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Moves stock of one warehouse to another';

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
        if(!Warehouse::whereIn('id', [$this->argument('source'), $this->argument('dest')])->exists()) {
            $this->error('Magazyn źródłowy/docelowy nie istnieje');

            return;
        }

        $stock = WarehousesStock::with(['item', 'element'])
            ->where('warehouse_id', $this->argument('source'))
            ->get();

        foreach($stock as $source) {
            $destination = WarehousesStock::where('warehouse_id', $this->argument('dest'))
                ->where('item_id', $source->item_id)
                ->first();

            if(!$destination) {
                $destination = WarehousesStock::create([
                    'warehouse_id' => $this->argument('dest'),
                    'item_id' => $source->item_id,
                    'quantity' => 0,
                ]);
            }

            if($source->item->has_data) {
                $source->element->each(function($element) use($destination) {
                    $destination->element()->create([
                        'sn' => $element->sn,
                        'mac' => $element->mac,
                        'item_id' => $element->item_id,
                    ]);

                    $element->delete();
                });
            }

            $destination->increment('quantity', $source->quantity);
            $source->decrement('quantity', $source->quantity);
        }
    }
}
