<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Car;
use App\CarsItem;
use App\Item;
use Storage;

class CarImportCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'car:import {id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import products to car {id} from local_path/import/car.csv';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        
        $this->temp = null;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {        
        $car = Car::find($this->argument('id'));
        
        if($car) {
            $handle = fopen(Storage::disk('local')->path('import/car.csv'), 'r');
            
            while(($line = fgets($handle)) !== false) {
                $a = explode(';', $line);
                
                $item = array_map('trim', $a);
                
                if(!empty($item[3])) {
                    $result = Item::where('id', $a[0])
                                    ->first();
                    
                    if($result) {
                        if(!CarsItem::where(['item_id' => $result->id, 'car_id' => $this->argument('id')])->increment('quantity', (int) $a[3])) {
                            $car->carsItem()->create([
                                'car_id' => $this->argument('id'),
                                'item_id' => $result->id,
                                'quantity' => (int) $a[3],
                            ]);
                        }
                    }
                } else {
                    if(strlen($a[0]) > 0) {
                        $result = Item::where('id', $a[0])
                                    ->first();
                        
                        $this->temp = $result;
                    } else {
                        $result = $this->temp;
                    }
                    
                    if($result) {
                        if(!CarsItem::where(['item_id' => $result->id, 'car_id' => $this->argument('id')])->increment('quantity', 1)) {
                            $res = $car->carsItem()->create([
                                'item_id' => $result->id,
                                'quantity' => 1,
                            ]);
                        } else {
                            $res = CarsItem::where(['item_id' => $result->id, 'car_id' => $this->argument('id')])->first();
                        }
                        
                        $res->element()->create([
                            'item_id' => $result->id,
                            'mac' => $a[2],
                            'sn' => $a[1],
                        ]);
                    }
                }
            }
        }
    }
}
 