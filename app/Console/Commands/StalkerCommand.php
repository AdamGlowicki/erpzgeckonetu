<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class StalkerCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stalker:import';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Imports STB devices from Stalker';

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
        $devices = app('App\Stalker')->devices();
        
        foreach($devices as $device) {
            if((int) $device->account_number) {
                $id = (int) $device->account_number;
                $mac = str_replace(':', '', strtoupper($device->stb_mac));
                $sn = $device->stb_sn;
                $model = str_replace('MAG', '', $device->stb_type);
                
                if(str_contains($mac, '1027')) {
                    $model = 'TVIP';
                }
                
                if(\App\Element::where(['sn' => $sn, 'element_type' => 'App\ClientsItem'])->first()) {
                    continue;
                }

                if(\App\Element::where(['sn' => $sn, 'element_type' => 'App\InvestmentsItem'])->first()) {
                    continue;
                }
                
                $client = (new \App\Client())->search($id);
                
                $result = \App\Client::where('client_id', $client[0]->id)->first();

                if(!isset($result->id)) {
                    $result = app('App\Client')->add($client);
                }
                
                $item = \App\Item::where('model_name', 'LIKE', '%'. $model .'%')->first();

                if(!isset($item->id)) {
                    $item = \App\Item::create([
                        'items_manufacturer_id' => \App\ItemsManufacturer::where('name', 'INFOMIR')->first()->id,
                        'items_category_id' => \App\ItemsCategory::where('name', 'DEKODER')->first()->id,
                        'unit_id' => \App\Unit::where('name', 'sztuka')->first()->id,
                        'model_name' => 'MAG '. $model,
                        'low_quant' => 1,
                        'has_data' => 1,
                    ]);
                }
                    
                echo $id ." | ". $model ." | ". $sn ."\n";
                
                if(!\App\ClientsItem::where(['item_id' => $item->id, 'client_id' => $result->id])->increment('quantity', 1)) {
                    $clientsItem = \App\ClientsItem::create([
                        'item_id' => $item->id,
                        'client_id' => $result->id,
                        'quantity' => 1,
                    ]);
                } else {
                    $clientsItem = \App\ClientsItem::where(['item_id' => $item->id, 'client_id' => $result->id])->first();
                }

                $clientsItem->element()->create([
                    'item_id' => $item->id,
                    'mac' => '',
                    'sn' => $sn,
                ]);
            }
        }
    }
}
