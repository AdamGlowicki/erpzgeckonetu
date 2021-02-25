<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\App;
use Rap2hpoutre\FastExcel\FastExcel;
use Mail;

class NetstorkNetworkAccessCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'netstork:get';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get network access localization list from Netstork database';

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
        $result = \App\Netstork\Building::with(['buildingStatus', 'buildingType', 'buildingTechnology', 'address'])
            ->whereHas('buildingStatus', function($query) {
                $query->whereIn('id', [2, 6, 7, 9]);
            })
            ->get();

        $rows = [];

        $bar = $this->output->createProgressBar(count($result));
        $bar->start();

        foreach($result as $building) {
            $bar->advance();

            if(!$building->address->street_teryt_code) {
                echo 'Brak adresu' . PHP_EOL;

                continue;
            }

            $split = explode('_', $building->address->street_teryt_code);   

            $simc = $split[0];
            $ulic = $split[1];

            $teryt = \App\TerytUlic::with(['terytSimc'])
                ->where('SYM', $simc)
                ->where('SYM_UL', $ulic)
                ->first();

            if(!$teryt) {
                echo 'Brak adresu TERYT' . PHP_EOL;

                continue;
            }

            $rows[] = [
                'city' => $teryt->terytSimc->NAZWA,
                'street' => $teryt->NAZWA_1,
                'building_num' => $building->building_number,
                'status' => $building->buildingStatus->value ?? '',
                'building_type' => $building->buildingType->value ?? '',
                'technology' => $building->buildingTechnology->value ?? '',
                'wsd' => $building->node_name,
                'dp' => $building->dp_name,
            ];
        }

        $bar->finish();

        $collection = collect($rows);

        (new FastExcel($collection))->export('storage/app/netstork.xlsx');

        if(App::environment('production')) {
            Mail::send('emails.netstork', [], function($message) {
                $message->from('erp@geckonet.pl', 'GeckoERP');
                $message->sender('erp@geckonet.pl', 'GeckoERP');
                $message->to('mateusz.brzeski@geckonet.pl', $name = null);
                $message->cc(['adam@geckonet.pl', 'radoslaw.sulkowski@geckonet.pl'], $name = null);
                // $message->bcc($address, $name = null);
                $message->replyTo('radoslaw.sulkowski@geckonet.pl', $name = null);
                $message->subject('Raport Netstork - '. Carbon::now()->format('Y-m-d'));
                // $message->priority($level);

                $message->attach(storage_path('app/netstork.xlsx'));
            });
        }
    }
}
