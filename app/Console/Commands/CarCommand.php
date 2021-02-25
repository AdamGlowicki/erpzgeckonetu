<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Car;

class CarCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'car:clean {id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Car clean';

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
        $result = Car::find($this->argument('id'));
        
        foreach($result->carsItem as $item) {
            foreach($item->element as $element) {
                $element->delete();
            }
            
            $item->delete();
        }
    }
}
