<?php

namespace App\Console\Commands;

use App\Rwdz;
use Illuminate\Console\Command;

class RWDZGeoportalCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rwdz_geoportal:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get Rwdz list and update location points from Geoportal by parcel';

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
        $result = Rwdz::all();

        foreach($result as $row) {
            if($row->x1 !== null) {
                continue;
            }

            $result = app('App\Geoportal')->get($row->jednosta_numer_ew . '.' . $row->obreb_numer . '.' . $row->numer_dzialki);

            if(!$result) {
                continue;
            }

            $row->update([
                'x1' => $result[0]->lng,
                'y1' => $result[0]->lat,
                'x2' => $result[1]->lng,
                'y2' => $result[1]->lng,
            ]);
        }
    }
}
