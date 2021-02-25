<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMailUserIdToBodiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('bodies', function (Blueprint $table) {
            $table->unsignedBigInteger('email_user_id')->nullable();
            $table->unsignedBigInteger('second_email_user_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('bodies', function (Blueprint $table) {
            $table->dropColumn('email_user_id');
            $table->dropColumn('second_email_user_id');
        });
    }
}
