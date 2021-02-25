<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Client;

class ClientCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'client:update {client_id?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Updates clients data';

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
        if($this->argument('client_id')) {
            $client = Client::where('client_id', $this->argument('client_id'))->first();

            if($client) {
                $result = app('App\Client')->search($client->client_id);

                $client->name = $result[0]->name .' '. $result[0]->lastname;
                $client->save();
            }

            return true;
        }

        $clients = Client::all();

        $bar = $this->output->createProgressBar(count($clients));

        foreach($clients as $client) {
            $result = app('App\Client')->search($client->client_id);

            $address = '';

            if(isset($result[0]->addresses)) {
                if(isset($result[0]->addresses[0])) {
                    if($result[0]->addresses[0]->street !== null) {
                        $address = $result[0]->addresses[0]->street .' '. $result[0]->addresses[0]->house . ($result[0]->addresses[0]->flat !== null ? ' lokal '. $result[0]->addresses[0]->flat : '') .', '. $result[0]->addresses[0]->postoffice;
                    } else {
                        $address = $result[0]->addresses[0]->city .' '. $result[0]->addresses[0]->house . ($result[0]->addresses[0]->flat !== null ? ' lokal '. $result[0]->addresses[0]->flat : '') .', '. $result[0]->addresses[0]->postoffice;
                    }
                }
            }

            $client->address = $address;
            $client->name = $result[0]->name .' '. $result[0]->lastname;
            $client->save();

            $bar->advance();
        }

        $bar->finish();
    }
}
