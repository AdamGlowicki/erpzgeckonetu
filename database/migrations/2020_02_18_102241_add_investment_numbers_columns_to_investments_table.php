<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Investment;

class AddInvestmentNumbersColumnsToInvestmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('investments', function (Blueprint $table) {
            $table->unsignedInteger('num_year')->after('warehouse_id');
            $table->unsignedInteger('num_year_id')->after('warehouse_id');
            $table->string('num_city')->after('warehouse_id');
            $table->unsignedInteger('num_city_id')->after('warehouse_id');
            $table->string('num_type')->after('warehouse_id');
        });

        $result = Investment::all();

        foreach($result as $investment) {
            $array = explode('/', $investment->investment_name);

            if(count($array) !== 5) {
                continue;
            }

            $investment->update([
                'num_year' => $array[0],
                'num_year_id' => $array[1],
                'num_city' => $array[2],
                'num_city_id' => $array[3],
                'num_type' => $array[4],
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('investments', function (Blueprint $table) {
            $table->dropColumn('num_type');
            $table->dropColumn('num_city_id');
            $table->dropColumn('num_city');
            $table->dropColumn('num_year_id');
            $table->dropColumn('num_year');
        });
    }
}
