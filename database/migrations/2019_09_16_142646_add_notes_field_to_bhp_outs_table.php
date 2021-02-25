<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddNotesFieldToBhpOutsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('bhp_outs', function (Blueprint $table) {
            $table->string('notes')->nullable()->after('document_name');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('bhp_outs', function (Blueprint $table) {
            $table->dropColumn('notes');
        });
    }
}
