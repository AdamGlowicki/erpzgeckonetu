<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class TerytCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'teryt:import';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Terypt import command';

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
        $files = [
            'terc' => storage_path('app/teryt/terc.xml'),
            'simc' => storage_path('app/teryt/simc.xml'),
            'ulic' => storage_path('app/teryt/ulic.xml'),
            'wmrodz' => storage_path('app/teryt/wmrodz.xml'),
        ];

        foreach($files as $type => $file) {
            switch($type) {
                case 'terc':
                    $xml = simplexml_load_file($file);

                    foreach($xml->catalog->row as $row) {
                        \DB::table('teryt_terc')->insert([
                            'WOJ' => $row->WOJ,
                            'POW' => $row->POW,
                            'GMI' => $row->GMI,
                            'RODZ' => $row->RODZ,
                            'NAZWA' => $row->NAZWA,
                            'NAZDOD' => $row->NAZDOD,
                            'STAN_NA' => $row->STAN_NA,
                        ]);
                    }

                    break;
                case 'simc':
                    $xml = simplexml_load_file($file);

                    foreach($xml->catalog->row as $row) {
                        \DB::table('teryt_simc')->insert([
                            'WOJ' => $row->WOJ,
                            'POW' => $row->POW,
                            'GMI' => $row->GMI,
                            'RODZ_GMI' => $row->RODZ_GMI,
                            'RM' => $row->RM,
                            'MZ' => $row->MZ === 'tak',
                            'NAZWA' => $row->NAZWA,
                            'SYM' => $row->SYM,
                            'SYMPOD' => $row->SYMPOD,
                            'STAN_NA' => $row->STAN_NA,
                        ]);
                    }

                    break;
                case 'ulic':
                    $xml = simplexml_load_file($file);

                    foreach($xml->catalog->row as $row) {
                        \DB::table('teryt_ulic')->insert([
                            'WOJ' => $row->WOJ,
                            'POW' => $row->POW,
                            'GMI' => $row->GMI,
                            'RODZ_GMI' => $row->RODZ_GMI,
                            'SYM' => $row->SYM,
                            'SYM_UL' => $row->SYM_UL,
                            'CECHA' => $row->CECHA,
                            'NAZWA_1' => $row->NAZWA_1,
                            'NAZWA_2' => $row->NAZWA_2,
                            'STAN_NA' => $row->STAN_NA,
                        ]);
                    }

                    break;
                case 'wmrodz';
                    $xml = simplexml_load_file($file);

                    foreach($xml->catalog->row as $row) {
                        \DB::table('teryt_wmrodz')->insert([
                            'RM' => $row->RM,
                            'NAZWA_RM' => $row->NAZWA_RM,
                            'STAN_NA' => $row->STAN_NA,
                        ]);
                    }

                    break;
            }

        }
    }
}
