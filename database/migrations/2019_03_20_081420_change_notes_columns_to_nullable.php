<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeNotesColumnsToNullable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cars_ins', function (Blueprint $table) {
            $table->string('notes')->nullable()->change();
        });
        
        Schema::table('cars_outs', function (Blueprint $table) {
            $table->string('notes')->nullable()->change();
        });
        
        Schema::table('warehouses_in', function (Blueprint $table) {
            $table->string('notes')->nullable()->change();
        });
        
        Schema::table('warehouses_in_cars', function (Blueprint $table) {
            $table->string('notes')->nullable()->change();
        });
        
        Schema::table('warehouses_out_cars', function (Blueprint $table) {
            $table->string('notes')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cars_ins', function (Blueprint $table) {
            //
        });
    }
}
