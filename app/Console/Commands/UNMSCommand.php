<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\UNMS;
use App\Client;
use App\ClientsItem;
use App\Investment;
use App\InvestmentsItem;
use App\Item;
use App\ItemsManufacturer;
use App\ItemsCategory;
use App\Unit;
use App\Element;

class UNMSCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'unms:import';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'UNMS API handling';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(UNMS $unms)
    {
        parent::__construct();
        
        $this->unms = $unms;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        foreach($this->unms->devices() as $device) {
            $ip = $device->ipAddress;
            $model = $device->identification->model;
            $mac = str_replace(':', '', strtoupper($device->identification->mac));

            if($model === 'AF2X' || $model === 'AF4X') {
                $model = str_split($model, 2);
                $model = $model[0] .'-'. $model[1];
            }

            if(Element::where(['mac' => $mac, 'element_type' => 'App\ClientsItem'])->first()) {
                continue;
            }

            if(Element::where(['mac' => $mac, 'element_type' => 'App\InvestmentsItem'])->first()) {
                continue;
            }

            $client = (new Client())->search($device->ipAddress);

            iF(!isset($client[0])) {
                if(preg_match('/^(\d{1,4})(-(\d{1,2}))?$/sU', $device->identification->hostname, $matches)) {
                    $client = (new Client())->search($matches[1]);
                }
            }

            echo $ip ." | ". $model ." => ". (isset($client[0]) ? $client[0]->id : 'ID /hostname: '. $device->identification->hostname) ." => MAC: ". $mac ."\n";

            $item = Item::where('model_name', 'LIKE', '%'. $model .'%')->first();

            if(!$item) {
                $item = Item::create([
                    'items_manufacturer_id' => ItemsManufacturer::where('name', 'UBIQUITI')->first()->id,
                    'items_category_id' => ItemsCategory::where('name', 'ANTENA')->first()->id,
                    'unit_id' => Unit::where('name', 'sztuka')->first()->id,
                    'model_name' => $model,
                    'low_quant' => 1,
                    'has_data' => 1,
                ]);
            }

            if(isset($client[0])) {
                $result = Client::where('client_id', $client[0]->id)->first();

                if(!$result) {
                    $result = app('App\Client')->add($client);
                }

                if(!ClientsItem::where(['item_id' => $item->id, 'client_id' => $result->id])->increment('quantity', 1)) {
                    $clientsItem = ClientsItem::create([
                        'item_id' => $item->id,
                        'client_id' => $result->id,
                        'quantity' => 1,
                    ]);
                } else {
                    $clientsItem = ClientsItem::where(['item_id' => $item->id, 'client_id' => $result->id])->first();
                }

                $clientsItem->element()->create([
                    'item_id' => $item->id,
                    'mac' => $mac,
                    'sn' => '',
                ]);
            } else {
                $investment = Investment::where('investment_name', 'LIKE', '%MAG/0000/%')->first();

                if(!InvestmentsItem::where(['item_id' => $item->id, 'investment_id' => $investment->id])->increment('quantity', 1)) {
                    $investmentsItem = InvestmentsItem::create([
                        'item_id' => $item->id,
                        'investment_id' => $investment->id,
                        'quantity' => 1,
                    ]);
                } else {
                    $investmentsItem = InvestmentsItem::where(['item_id' => $item->id, 'investment_id' => $investment->id])->first();
                }

                $investmentsItem->element()->create([
                    'item_id' => $item->id,
                    'mac' => $mac,
                    'sn' => '',
                ]);
            }
        }
    }
}
