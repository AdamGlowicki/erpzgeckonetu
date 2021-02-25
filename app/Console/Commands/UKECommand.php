<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Ixudra\Curl\Facades\Curl;
use App\Uke;

class UKECommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'uke:dump';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'UKE dump';

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
        for($i=1;;$i++) {
            $obj = (object) [];
            
            $response = Curl::to('https://archiwum.uke.gov.pl/marta/index.php?p=4&page=1&numer=' . $i)
                    ->get();
            
            preg_match_all('/<p.*\">(.*)<\/p>/sU', $response, $main);
            
            echo "\n\n" . $i . "\n\n";
            
            if(isset($main[1][0])) {
                if(strlen($main[1][0]) < 1) {
                    continue;
                }
                
                $obj->obj_id = strip_tags($main[1][0]);
                
                if(Uke::where('obj_id', $obj->obj_id)->first()) {
                    continue;
                }
                
                $obj->name = strip_tags($main[1][1]);
                $obj->type = strip_tags($main[1][2]);
                $obj->nip = strip_tags($main[1][3]);
                $obj->krs = str_replace('KRS ', '', strip_tags($main[1][4]));
                $obj->address = strip_tags($main[1][5]);
                
                preg_match_all('/<td align="center">(.*)<\/td>/sU', $response, $info);
                
                foreach($info[1] as $row) {
                    $obj->data[] = strip_tags($row);
                }
                
                $obj->data = json_encode($obj->data);
                
                Uke::create((array) $obj);
            }
        }
    }
}