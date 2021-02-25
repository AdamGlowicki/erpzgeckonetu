<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Storage;
use App\Ekw;

class EKWToFilesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ekw:export';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Export EKWs to files';

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
        Storage::disk('local')->makeDirectory('ekw');
        
        $result = Ekw::all();
        
        foreach($result as $ekw) {
            Storage::disk('local')->put("ekw/{$ekw->sad}{$ekw->numer}{$ekw->ck}_okladka.dat", $ekw->okladka);
            Storage::disk('local')->put("ekw/{$ekw->sad}{$ekw->numer}{$ekw->ck}_adres.dat", $ekw->adres);
            Storage::disk('local')->put("ekw/{$ekw->sad}{$ekw->numer}{$ekw->ck}_prawa.dat", $ekw->prawa);
            Storage::disk('local')->put("ekw/{$ekw->sad}{$ekw->numer}{$ekw->ck}_wlasc.dat", $ekw->wlasc);
            Storage::disk('local')->put("ekw/{$ekw->sad}{$ekw->numer}{$ekw->ck}_roszcz.dat", $ekw->roszcz);
            Storage::disk('local')->put("ekw/{$ekw->sad}{$ekw->numer}{$ekw->ck}_hipo.dat", $ekw->hipo);
        }
    }
}
