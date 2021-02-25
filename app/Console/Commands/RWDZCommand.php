<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Curl;
use Storage;
use Zipper;
use DB;
use DateTime;

class RWDZCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rwdz {action}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Imports RWDZ list to database';

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
        $response = Curl::to('http://wyszukiwarka.gunb.gov.pl/pobranie.html')
                ->get();

        $list = [];

        preg_match_all('/<li><b><a href="(.*)">woj.* (.*)<\/a><\/b>/sU', $response, $list);

        foreach($list[1] as $i => $file) {
            $data = Curl::to('http://wyszukiwarka.gunb.gov.pl/'. $file)
                    ->get();

            Storage::disk('local')->put('rwdz/'. $i .'.zip', $data);

            Zipper::make(Storage::disk('local')->path('rwdz/'. $i .'.zip'))->extractTo(Storage::disk('local')->path('rwdz'));

            Storage::disk('local')->delete('rwdz/'. $i .'.zip');
        }

        $csvlist = Storage::disk('local')->files('rwdz');

        switch($this->argument('action')) {
            case 'update':
                DB::table('rwdz')->where('data_wplywu_wniosku', '>=', (new DateTime('first day of this month'))->format('Y-m-d'))->delete();

                foreach($csvlist as $file) {
                    $handle = fopen(Storage::disk('local')->path($file), 'r');

                    echo 'Processing file: '. $file ."\n";

                    $i = 0;

                    while(($line = fgets($handle)) !== false) {
                        $i++;

                        if(!($i > 1)) {
                            continue;
                        }

                        $a = explode('#', $line);

                        if(count($a) !== 32) {
                            continue;
                        }

                        if($a[18] != 'XVIII') {
                            continue;
                        }

                        $check = \App\Rwdz::where('numer_urzad', $a[0])
                            ->where('numer_decyzji_urzedu', $a[4])
                            ->exists();

                        if($check) {
                            continue;
                        }

                        DB::table('rwdz')->insert($this->keys($a));
                    }

                    echo 'File processed. Records: '. $i ."\n";

                    fclose($handle);

                    Storage::disk('local')->delete($file);
                }

                break;
            case 'init':
                DB::table('rwdz')->truncate();

                foreach($csvlist as $file) {
                    $handle = fopen(Storage::disk('local')->path($file), 'r');

                    echo 'Processing file: '. $file ."\n";

                    $i = 0;

                    while(($line = fgets($handle)) !== false) {
                        $i++;

                        if(!($i > 1)) {
                            continue;
                        }

                        $a = explode('#', $line);

                        if(count($a) !== 32) {
                            continue;
                        }

                        if($a[18] != 'XVIII') {
                            continue;
                        }

                        var_dump($a);

                        DB::table('rwdz')->insert($this->keys($a));
                    }

                    echo 'File processed. Records: '. $i ."\n";

                    fclose($handle);

                    Storage::disk('local')->delete($file);
                }

                break;
        }

    }

    public function keys($array) {
        return [
            'numer_urzad' => $array[0],
            'nazwa_organu' => $array[1],
            'adres_organu' => $array[2],
            'data_wplywu_wniosku' => $array[3],
            'numer_decyzji_urzedu' => $array[4],
            'data_wydania_decyzji' => $array[5],
            'nazwisko_inwestora' => $array[6],
            'imie_inwestora' => $array[7],
            'nazwa_inwestor' => $array[8],
            'wojewodztwo' => $array[9],
            'miasto' => $array[10],
            'terc' => $array[11],
            'cecha' => $array[12],
            'cecha_1' => $array[13],
            'ulica' => $array[14],
            'ulica_dalej' => $array[15],
            'nr_domu' => $array[16],
            'rodzaj_inwestycji' => $array[17],
            'kategoria' => $array[18],
            'nazwa_zamierzenia_bud' => $array[19],
            'nazwa_zam_budowlanego' => $array[20],
            'kubatura' => $array[21],
            'projektant_nazwisko' => $array[22],
            'projektant_imie' => $array[23],
            'projektant_numer_uprawnien' => $array[24],
            'jednosta_numer_ew' => $array[25],
            'obreb_numer' => $array[26],
            'numer_dzialki' => $array[27],
            'numer_arkusza_dzialki' => $array[28],
            'jednostka_stara_numeracja_z_wniosku' => $array[29],
            'stara_numeracja_obreb_z_wnioskiu' => $array[30],
            'stara_numeracja_dzialka_z_wniosku' => $array[31],
        ];
    }
}
