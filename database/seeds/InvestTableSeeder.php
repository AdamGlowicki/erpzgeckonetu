<?php

use Illuminate\Database\Seeder;

class InvestTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $first[] =  [
            'parent_id' => null,
            'level' => null,
            'client' => 'dsdasdsadsa',
            'stage_name' => 'dasdsadssa',
        ];
        $second[] = [
            'parent_id' => 1,
            'level' => 1,
            'client' => 'dwawawd',
            'stage_name' => 'dwaada',
        ];
        $third = [
            'parent_id' => 1,
            'level' => 1,
            'client' => 'dwawdaw',
            'stage_name' => 'dwaddwaawd',
        ];

        DB::table('invests')->insert($first);
        DB::table('invests')->insert($second);
        DB::table('invests')->insert($third);
    }
}
