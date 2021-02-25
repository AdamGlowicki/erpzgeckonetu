<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateElementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('elements', function (Blueprint $table) {
            $table->increments('id');
            $table->morphs('element');
            $table->unsignedInteger('item_id');
            $table->string('mac')->nullable();
            $table->string('sn')->nullable();
            $table->timestamps();

            $table->unique(['mac', 'sn', 'element_type']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('elements', function (Blueprint $table) {
            $table->dropIndex(['mac', 'sn', 'element_type']);
        });
    }
}
